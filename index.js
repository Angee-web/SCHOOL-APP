// import express 1
const express = require("express");
// import the db connection from the file it was connected 11
const db = require("./dbConn/conn")
// import the routes 24
const studentRoute = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const instructorRoutes = require("./routes/instructorRoutes");



// create instance 2
const app = express();
// assign port 3
const port = 3001;

// turn on the connection to the db 12
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

// use middlewares 5
app.use(express.json());

// welcome message when visiting the app interface
const welcomeMessage = (req, res, next) => {
    console.log("Welcome to our school app");
    // this is used to move to the next middleware
    next();
};

// this executes for every route on this server
app.use(welcomeMessage);


// goodbye message
const thankYou = (req, res, next) => {
    console.log("Thank you for using our school app");
    next();
};

app.use(thankYou);

// listen to the port 4
app.listen(port, () => {
    console.log(`App is running on port ${
        port}`);
});

// connect to home route and other routes 5
app.get("/", (req, res) => {
    res.send("Hello You!");
});

app.get("/about", (req, res) => {
    res.send("About You!");
});

app.post("/about", (req, res) => {
    console.log(req.body);
    res.send("Post You");
});

// register auth route
app.use("/api/v1", authRoutes);
// register instructor route
app.use("/api/v1", instructorRoutes);
// register course route
app.use("/api/v1", courseRoutes);
// use the student route 25
app.use("/api/v1", studentRoute);

// execute after all action has been executed
