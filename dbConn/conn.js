// import mongoose 7
const mongoose = require("mongoose");

// connect to the atlas database with the connection string 8
mongoose.connect(
    "mongodb+srv://adaezeugwumba460:Dabu6039@cluster0.bqjorqm.mongodb.net/School-App?retryWrites=true&w=majority&appName=Cluster0/School-App"
);

// assign the connection string to db 9
const db = mongoose.connection;

// export the db variable 10
module.exports = db;
