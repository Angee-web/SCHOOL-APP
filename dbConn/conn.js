const dotenv  = require("dotenv");
// import mongoose 7
const mongoose = require("mongoose");
dotenv.config();

// connect to the atlas database with the connection string 8
mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING
);

// assign the connection string to db 9
const db = mongoose.connection;

// export the db variable 10
module.exports = db;
