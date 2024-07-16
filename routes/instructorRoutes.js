//destructure the router from express 19
const { Router } = require("express");
// import instructor controller from the file 20
const instructorController = require("../controllers/instructorController");

//assign Router functions to a router variable 21
const router = Router();

// // implement all the methods here via the route 22
router.get("/instructor", instructorController.getInstructor);

router.post("/instructor", instructorController.createInstructor);

router.get("/instructor/:instructorId", instructorController.getOneInstructor);

router.patch("/instructor/:instructorId", instructorController.updateInstructor);

router.delete("/instructor/:instructorId", instructorController.removeInstructor);



// export the router functinality 23
module.exports = router;