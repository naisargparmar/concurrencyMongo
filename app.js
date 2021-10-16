var express = require("express");

const db = require("./demo");
db.getClient();

const app = express();


app.use( express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.get('/test', function (req, res) {
	// db.listDatabases()
  	res.send('hello world')
})

app.post('/insert', function (req, res) {
	db.insertBooking(req.body).then((data) => {
        let status = data.success == true ? 200 : 500;
        res.status(status).json({
            success: data.success,
            message: data.success ? "Record added successfully" : data.message,
            data: data.data
        });
    })
})

// error handler
app.use((err, req, res, next) => {
    if (err) {
        if (err.status) {
            res.status(err.status).json({
                success: false,
                error: err.error
            });
        } else {
            res.status(404).json({
                success: false,
                error: `${err.name}: ${err.error}`
            });
        }
        return;
    }
});

let PORT = process.env.BACKEND_PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

module.exports = app;
