// import the courseSchema 
const Course = require("../models/courseModel");

// destructure ObjectId from mongodb
const { ObjectId } = require("mongodb");

exports.createCourse = async (req, res) => {
    try{
        const course = new Course(req.body);
        await course.save();
        // or
        // await course.create(req.body);
        res.status(201).send({
            status: "success",
            message: "Course Created Successfully"
        });
    } catch(error) {
        res.status(400).json({ message: error.message});
    }
};

exports.getCourse = async (req,res) => {
    try {
        const course = await Course.find();
        res.status(201).send({
            status: "success",
            count: course.length,
            data: course,
        })

    }catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getOneCourse = async (req, res) => {
    try{
        const course = await Course.findById(req.params.courseId);
        // console.log(req.body);
        if (!course) {
            return res.status(404).send({
                status: "error",
                message: "course not found",
            });
        }
        res.status(200).send({
            status: "sucesss",
            data: course,
        });
    } catch (error){
        res.status(500).json({message: error.message})
    }
};

exports.updateCourse = async (req, res) => {
    const id = req.params.courseId; // Extract the course ID from request params
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            id, // Find course by ID
            req.body, // Update with the data from request body
            { new: true, runValidators: true } // Options: new returns the updated document, runValidators ensures validation rules are applied
        );
        if (!updatedCourse) {
            return res.status(404).json({
                status: "error",
                message: "course not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: updatedCourse,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.updateFullCourse = async (req, res) => {
    const id = req.params.courseId; // Extract the student ID from request params
    try {
        const updatedFullCourse = await Course.findByIdAndUpdate(
            id, // Find student by ID
            req.body, // Update with the data from request body
            { new: true, runValidators: true } // Options: new returns the updated document, runValidators ensures validation rules are applied
        );
        if (!updatedFullCourse) {
            return res.status(404).json({
                status: "error",
                message: "Course not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: updatedFullCourse,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};


exports.removeCourse = async (req, res) => {
    const id = req.params.courseId; // Extract the student ID from request params
    try{
        const removedCourse = await Course.findByIdAndDelete(id);
        if(!removedCourse){
            return res.status(404).json({
                status: "error",
                message:"course not in db"
            });
        }
        res.status(200).json({
            status: "success",
            data: removedCourse,
        });
    }catch(err){
        return res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};