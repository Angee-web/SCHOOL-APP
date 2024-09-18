const mongoose = require("mongoose");

const { Schema } = mongoose;

const instructorSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    other_name: {
        type: String,
        required: false,
    },
    gender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    courses: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
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
        default: "instructor",
    }
});

// creating a model for instructor
const Instructor = mongoose.model("instructor", instructorSchema);

// export instructor model
module.exports = Instructor;