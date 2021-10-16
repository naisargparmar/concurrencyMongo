# ConcurrencyMongo
How really locking and transaction works with concurrent request in mongodb?

# Requirement
1. Node version I have used v12.13.1

# How to setup?
1. Clone concurrencyMongo folder.
2. Open terminal and change path to concurrencyMongo
3. node -v
   v12.13.1
   
   If node not v12.13.1 then use nvm to change node version for particular concurrencyMongo folder
   
   nvm use v12.13.1
4. npm install
5. npm start

# Api endpoint
1. Url: http://127.0.0.1:3001/insert
   Method: Post
   body: {email: "naisarg.parmar@yahoo.com"}
