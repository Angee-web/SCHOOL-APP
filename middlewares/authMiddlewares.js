const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if(!token) return res.status(400).send("Access denied");

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if(err) return res.status(403).send("Invalid token");
        req.id = user.id;
        req.role = user.role;
        next();
    })
}

exports.isStudent = (req, res, next) => {
    console.log("I'm here as a student");
    if(req.role !== "student") return res.status(401).send("Access denied");
    next();
}

exports.isInstructor = (req, res, next) => {
    console.log("I'm here as an instructor");
    if(req.role !== "instructor") return res.status(401).send("Access denied");
    next();
}


// OTP
