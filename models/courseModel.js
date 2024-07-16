const mongoose = require("mongoose");

const { Schema } = mongoose;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructor: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    students: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    requirements: {
        type: [String],
        required: false,
    },
    price: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// creating a model for course
const Course = mongoose.model("course", courseSchema);

// export course model
module.exports = Course;