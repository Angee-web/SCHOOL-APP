//destructure the router from express 19
const { Router } = require("express");
// import student controller from the file 20
const studentController = require("../controllers/studentController");

//assign Router functions to a router variable 21
const router = Router();

const getOneStudentMiddleWare = (req, res, next) => {
    console.log("This is a middleware that gets a single student");
    next();
};

// implement all the methods here via the route 22
router.post("/student", studentController.createStudent);



router.get("/student", studentController.getStudent);

router.get("/student/:studentId",getOneStudentMiddleWare, studentController.getOneStudent)

// router.get("/student/:studentId", studentController.getOneStudent);

router.patch("/student/:studentId", studentController.updateStudent);

router.put("/student/:studentId", studentController.updateFullStudent);

router.delete("/student/:studentId", studentController.removeStudent);




// export the router functinality 23
module.exports = router;