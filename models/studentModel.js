// import mongoose 13
const mongoose = require("mongoose");

// 14
const { Schema } = mongoose;

// 15
const studentSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    other_name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    course: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },
    age: {
        type: String,
        required: true,
        validate: (v) => v > 18 && v < 60
    },
    password: {
        type: String,
        required: true,
        validate: (v) => v.length > 6,
    },
    createdAt: {
        type: Date,
        defualt: Date.now,
    },
    role:{
        type: String,
        default: "student",
    }
});

const Student = mongoose.model("student", studentSchema);

// export student 16
module.exports = Student;