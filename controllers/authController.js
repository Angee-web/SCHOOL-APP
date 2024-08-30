// the auth controller controls the account creation for either instructor or student
// import the instructor and student models from the controller folder
const Instructor = require("../models/instructorModel");
const Student = require("../models/studentModel");
const Course = require("../models/courseModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

// Temporary storage for OTPs 
let otpStore = {};

// Function to create an account depending on the status of the user
exports.createAccount = async (req, res) => {
  const { account } = req.params;
  const { password } = req.body;

  // hashing the password to give a special encryption password to prevent hacking
  const hashedPassword = await bcrypt.hash(password, 10);
  req.body.password = hashedPassword;

  if (account == "student") {
    try {
      const isUserExist = await Student.findOne({ email: req.body.email });
      if (isUserExist) {
        return res.status(400).send({
          status: "error",
          message: "User already exist",
        });
      }
      const student = new Student(req.body);
      await student.save();
      res.status(201).send({
        status: "success",
        message: "Student account created successfully",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else if (account == "instructor") {
    try {
      const isUserExist = await Instructor.findOne({ email: req.body.email });
      if (isUserExist) {
        return res.status(400).send({
          status: "error",
          message: "User already exist",
        });
      }
      const instructor = new Instructor(req.body);
      await instructor.save();
      res.status(201).send({
        status: "success",
        message: "Instructor account created successfully",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

// Function to handle user login
// exports.login = async (req, res) => {
//     const { account } = req.params;
//     const { email, password } = req.body;

//     try {
//         let user;
//         if (account === "student") {
//             user = await Student.findOne({ email });
//         } else if (account === "instructor") {
//             user = await Instructor.findOne({ email });
//         }else{
//             return res.status(400).json({message: "invalid account type"})
//         }

//         if (!user) {
//             return res.status(400).send({
//                 status: "error",
//                 message: "User does not exist",
//             });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(400).send({
//                 status: "error",
//                 message: "Invalid password",
//             });
//         }

//         const token = jwt.sign({ id: user._id, email: user.email }, "your_secret_key", { expiresIn: "1h" });

//         res.status(200).send({
//             status: "success",
//             message: "Login successful",
//             token,
//         });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

exports.login = async (req, res) => {
  try {
    const { account } = req.params;
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "please provide an email and password" });
    }
    if (account === "instructor") {
      const instructor = await Instructor.findOne({ email });
      if (!instructor) {
        return res.status(400).json({ message: "instructor not found" });
      }
      const passwordMatch = await bcrypt.compare(password, instructor.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "password did not match" });
      }
      res.status(200).json({
        status: "success",
        message: "Instructor logged in successfully",
      });
    } else if (account === "student") {
      const student = await Student.findOne({ email });
      if (!student) {
        return res.status(400).json({ message: "student not found" });
      }
      const passwordMatch = await bcrypt.compare(password, student.password);

      if (!passwordMatch) {
        return res.status(400).json({ message: "password did not match" });
      }

      const token = jwt.sign({
        id: student._id, role: "student" },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
    )
      res.status(200).json({
        status: "success",
        data: {
            token,
            student: {
                id:student._id,
                name: student.name,
                email: student.email,
            },
        },
        message: "Student logged in successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// function to handle change password
exports.changePassword = async (req, res) => {
  // destructure the account from the params 
  const { account } = req.params;
  // destructue the email, password, and newpassword
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Please provide email, current password, and new password" });
  }
  try {
    let user;
    if (account === "student") {
      user = await Student.findOne({ email });
    } else if (account === "instructor") {
      user = await Instructor.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid account type" });
    }
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // compare the old password to the passwpord
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    // hash the new password and save it
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// function to update a single student's course
exports.updateStudentCourse = async (req, res) => {
  // destructure the stdent id and course id
  try {
    const { studentId } = req.params;
    const { courseId } = req.body;

    // Find the student by id
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update the course information
    student.course = courseId;
    await student.save();
    console.log(courseId);

    res.status(200).json({
      status: "success",
      message: "Student course updated successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        course: student.course,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// function to get colleagues
exports.getColleagues = async (req, res) => {
  try {
    const students = await Student.find({}, 'first_name other_name _id'); // Fetch only firstname, othername and id which will be stored in the empty array
    res.status(200).json({
      status: "success",
      message: "These are the students in the class",
      data: {students},
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// function to get one colleague
exports.getOneColleague = async (req, res) => {
  // const id = new ObjectId
  try {
    const { studentId } = req.params;
    const student = await Student.findById( studentId, 'first_name _id'); // Fetch only firstname and id which will be stored in the empty array
    if(!student) return res.status(404).json({message: "This user is not a student"});
    res.status(200).json({
      status: "success",
      message: "This is a student in the class",
      data: {student},
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// function to register a student for a course, adds a course to the course field in the student schema
exports.registerForCourse = async (req, res) => {
  try {
    // destructure courseid and studentid from the request body
    const { studentId, courseId } = req.body;

    // if no student or course is inputed
    if (!studentId || !courseId) {
      return res.status(400).json({ message: 'Student ID and Course ID are required' });
    }

    // find the student by id
    const student = await Student.findById(studentId);
    // if no student is found
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

// find the course by id from the collection
    const course = await Course.findById(courseId);
    // if the course is not found
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add the course to the student's list of courses using push and save
    student.course.push(courseId);
    await student.save();

    res.status(200).json({
      status: 'success',
      message: 'Student registered for the course successfully. Proceed to curriculum',
      student: {
        id: student._id,
        name: student.first_name,
        email: student.email,
        course: student.course,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function handles the "forgot password" process by generating a token that allows the user to reset their password. 
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Please provide an email address" });
//   }

//   try {
//     const user = await Student.findOne({ email }) || await Instructor.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET_KEY, { expiresIn: "1h" });

//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       host: "smtp.gmail.com",
//       port: 465,  // This port is for the Gmail SMTP server
//       secure: true,
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email, // Use the provided email from the request body
//       subject: 'Password Reset Request',
//       text: `You requested for a password reset. Please use the following token to reset your password: ${token}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return res.status(500).json({ message: error.message });
//       } else {
//         return res.status(200).json({ message: "Password reset token sent to email" });
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };


// This function handles the "forgot password" process by generating a token that allows the user to reset their password. For now, it logs the token to the console instead of sending it via email. It works when the user is not logged in
// exports.forgotPassword = async (req, res) => {
//   // The email is destructured from the request body.
//   const { email } = req.body;

//   try {
//     // Find the user by email
//     const user = await Student.findOne({ email }) || await Instructor.findOne({ email });

//     // if no user is found with the provided email, it responds with a 404 status and a message indicating the user was not found.
//     if (!user) {
//       return res.status(404).json({ message: "user not found" });
//     }

//     // Generate the token with the student's ID and with the secret key in the env file and set to expire in an hour
//     const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET_KEY, { expiresIn: "1h" });

//     // Log the token to the console instead of sending an email (still figuring out)
//     console.log(`Password reset token for ${email}: ${token}`);

//     // Respond with a success message if successful
//     res.status(200).json({token, message: "Password reset token generated. Check console for the token." });

// // catch any error
//   } catch (error) {
//     console.error("Error in forgotPassword:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


// function to reset passwoed  using a token generated after forget password function 
// exports.resetPassword = async (req, res) => {
//   // destructure the token and the new password from the request body
//   const { token, newPassword } = req.body;
  
//   // check if both token and new password are provided. If not, it responds with a 400 status
//   if (!token || !newPassword) {
//     return res.status(400).json({ message: "Please provide a token and a new password" });
//   }
  
//   // Verify that the token is using the secret key. If the token is valid, it decodes the token to retrieve the user ID.
//   try {
//     const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET_KEY);
    
//     // find a user with the decoded ID in either the Student or Instructor collections.
//     let user = await Student.findById(decoded.id) || await Instructor.findById(decoded.id);

//     // response if no user is found with the ID
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // hash the new password using bcypt with salt of 10
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     // responds with a success message indicating the password was reset successfully.
//     res.status(200).json({ message: "Password reset successfully" });
//   } 
//   // catches any errors during the process, responds with a 500 status and the error message.
//   catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// Function to handle forgot password and send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide an email address" });
  }

  try {
    const user = await Student.findOne({ email }) || await Instructor.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    
    // Store OTP with expiration time (e.g., 10 minutes)
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      res.status(200).json({ message: "OTP sent to email" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Function to handle password reset using OTP
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Please provide email, OTP, and new password" });
  }

  try {
    // Verify OTP
    const otpEntry = otpStore[email];
    if (!otpEntry || otpEntry.otp !== otp || Date.now() > otpEntry.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Find the user by e  mail
    let user = await Student.findOne({ email }) || await Instructor.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Remove OTP after successful password reset
    delete otpStore[email];

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
