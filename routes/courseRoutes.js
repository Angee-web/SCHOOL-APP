//destructure the router from express 19
const { Router } = require("express");
// import course controller from the file 20
const courseController = require("../controllers/courseController");

//assign Router functions to a router variable 21
const router = Router();

// // implement all the methods here via the route 22
router.get("/course", courseController.getCourse);

router.post("/course", courseController.createCourse);

router.get("/course/:courseId", courseController.getOneCourse);

router.patch("/course/:courseId", courseController.updateCourse);

router.delete("/course/:courseId", courseController.removeCourse);



// export the router functinality 23
module.exports = router;