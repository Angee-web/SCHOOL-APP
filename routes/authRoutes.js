const { Router } = require("express");
// destructure the routes
const { createAccount, login, changePassword, updateStudentCourse, getColleagues, getOneColleague, registerForCourse, forgotPassword, resetPassword } = require("../controllers/authController");

const router = Router();

// route to sign up for either student or instructor
router.post("/auth/create-account/:account", createAccount);

// route to login for either student or instructor
router.post("/auth/login/:account", login);

// route to change password
router.patch("/auth/change-password/:account", changePassword);

// route to update course
router.put("/auth/student/:studentId/course", updateStudentCourse);

// route to get colleagues
router.get('/auth/student/colleagues', getColleagues);

// route to get one collegue
router.get('/auth/student/:studentId', getOneColleague);

// route to register a student for a course
router.post('/auth/register-course', registerForCourse);

// route for forgot password
router.post('/auth/forgot-password', forgotPassword);

// route for reset password
router.post('/auth/reset-password', resetPassword);

module.exports = router;
