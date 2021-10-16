const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/" + "bisnocare";
var client = new MongoClient(uri);

exports.getClient = async () => {
	try {
		await client.connect();
		console.log("Database connected")
	}
	catch(e) {
		console.error(e)
	}
	finally {
		// await client.close();
	}
};

exports.listDatabases = async () => {
	const databasesList = await client.db().admin().listDatabases();
	console.log("Databases:");

	databasesList.databases.forEach(db => {
		console.log(`- ${db.name}`);
	})
};

exports.insertBooking = async (body = {}) => {
	try {
		console.log("body: ", body)
        const session = await client.startSession();
		const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        }
        
        try {
        	let insertedRecord;
            const transactionResults = await session.withTransaction( async () => {
            	let booking_count = await client.db("bisnocare").collection("bookings").countDocuments({}, {session});
				console.log("1 booking_count: ", booking_count)
				if (booking_count < 5) {
					insertedRecord = await client.db("bisnocare").collection("bookings").insertOne(body, {session})
					console.log("2 insertedRecord: ", insertedRecord.insertedId)
				}
				else {
					console.log("1 Abort Transaction")
					await session.abortTransaction();
				}

            }, transactionOptions);

            if (transactionResults) {
            	console.log("Transaction Success")
                // await session.commitTransaction();
                return {
                    success: true,
                    message: "Transaction Success",
                    data: insertedRecord.insertedId
                }
            }
            else {
                console.log("Transaction Failed")
                return {
                    success: false,
                    message: "1 Transaction Failed",
                    data: ""
                }
            }
        }
        catch (ex) {
            console.log("2 Transaction Failed", ex)
            await session.abortTransaction();
            return {
                success: false,
                message: "2 Transaction Failed",
                data: ""
            }
        }
        finally {
            await session.endSession();
        }
    } catch ( ex ) {
    	console.log("3 Transaction Failed: ", ex)
    	return {
            success: false,
            message: "3 Transaction Failed",
            data: ""
        }
    }
};



