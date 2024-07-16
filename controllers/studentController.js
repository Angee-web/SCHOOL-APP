// import the studentSchema 17
const Student = require("../models/studentModel");

const { ObjectId } = require("mongodb");

// all the methods 18
exports.createStudent = async (req, res) => {
    try{
        const student = new Student(req.body);
        await student.save();
        // or
        // await Student.create(req.body);
        res.status(201).send({
            status: "success",
            message: "Student Created Successfully"
        });
    } catch(error) {
        res.status(400).json({ message: error.message});
    }
};

exports.getStudent = async (req,res) => {
    try {
        const student = await Student.find();
        res.status(201).send({
            status: "success",
            count: student.length,
            data: student,
        })

    }catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getOneStudent = async (req, res) => {
    try{
        const student = await Student.findById(req.params.studentId);
        // console.log(req.body);
        if (!student) {
            return res.status(404).send({
                status: "error",
                message: "student not found",
            });
        }
        res.status(200).send({
            status: "sucesss",
            data: student,
        });
    } catch (error){
        res.status(500).json({message: error.message})
    }
};


// exports.updateStudent =  (req, res) => {
//     try{
//         const updateStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

//         res.status(200).json({
//             status: "successful",
//             data:{
//                 student: updateStudent
//             }
//         });
//     }catch(err){
//         res.status(404).json({
//             status:"fail",
//             message: err.message
//         });
//     }
// }

exports.updateStudent = async (req, res) => {
    const id = req.params.studentId; // Extract the student ID from request params
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            id, // Find student by ID
            req.body, // Update with the data from request body
            { new: true, runValidators: true } // Options: new returns the updated document, runValidators ensures validation rules are applied
        );
        if (!updatedStudent) {
            return res.status(404).json({
                status: "error",
                message: "Student not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: updatedStudent,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.updateFullStudent = async (req, res) => {
    const id = req.params.studentId; // Extract the student ID from request params
    try {
        const updatedFullStudent = await Student.findByIdAndUpdate(
            id, // Find student by ID
            req.body, // Update with the data from request body
            { new: true, runValidators: true } // Options: new returns the updated document, runValidators ensures validation rules are applied
        );
        if (!updatedFullStudent) {
            return res.status(404).json({
                status: "error",
                message: "Student not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: updatedFullStudent,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.removeStudent = async (req, res) => {
    const id = req.params.studentId; // Extract the student ID from request params
    try{
        const removedStudent = await Student.findByIdAndDelete(id);
        if(!removedStudent){
            return res.status(404).json({
                status: "error",
                message:"Student not in db"
            });
        }
        res.status(200).json({
            status: "success",
            data: removedStudent,
        });
    }catch(err){
        return res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};