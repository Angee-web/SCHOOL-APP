// import the instructorSchema 
const Instructor = require("../models/instructorModel");

// destructure ObjectId from mongodb
const { ObjectId } = require("mongodb");

exports.createInstructor = async (req, res) => {
    try{
        const instructor = new Instructor(req.body);
        await instructor.save();
        // console.log(instructor);
        // or
        // await instructor.create(req.body);
        res.status(201).send({
            status: "success",
            message: "Instructor Created Successfully"
        });
    } catch(error) {
        res.status(400).json({ message: error.message});
    }
};

exports.getInstructor = async (req,res) => {
    try {
        const instructor = await Instructor.find();
        res.status(201).send({
            status: "success",
            count: instructor.length,
            data: instructor,
        })

    }catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getOneInstructor = async (req, res) => {
    try{
        const instructor = await Instructor.findById(req.params.instructorId);
        // console.log(req.body);
        if (!instructor) {
            return res.status(404).send({
                status: "error",
                message: "instructor not found",
            });
        }
        res.status(200).send({
            status: "sucesss",
            data: instructor,
        });
    } catch (error){
        res.status(500).json({message: error.message})
    }
};

exports.updateInstructor = async (req, res) => {
    const id = req.params.instructorId; // Extract the instructor ID from request params
    try {
        const updatedInstructor = await Instructor.findByIdAndUpdate(
            id, // Find instructor by ID
            req.body, // Update with the data from request body
            { new: true, runValidators: true } // Options: new returns the updated document, runValidators ensures validation rules are applied
        );
        if (!updatedInstructor) {
            return res.status(404).json({
                status: "error",
                message: "instructor not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: updatedInstructor,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.removeInstructor = async (req, res) => {
    const id = req.params.instructorId; // Extract the student ID from request params
    try{
        const removedInstructor = await Instructor.findByIdAndDelete(id);
        if(!removedInstructor){
            return res.status(404).json({
                status: "error",
                message:"Instructor not in db"
            });
        }
        res.status(200).json({
            status: "success",
            data: removedInstructor,
        });
    }catch(err){
        return res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};