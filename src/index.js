const express = require('express');
const config = require('./config');
const User = require('./../models/userModel');
const Course = require('../models/courseModel')
const AddDropCourse = require('./../models/addDeleteModel')
const Faculty = require('./../models/facultyModel');
const Feedback = require('./../models/feedbackModel');
const Scholarship = require('./../models/scholarshipSchema')
const Admin=require('./../models/adminModel')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer')
const path = require('path')
const session = require('express-session')

const app = express();
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: "ankitkumar1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: false
    }
}))
app.set('view engine', 'ejs');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {

        const fileName = `${req.session.user.loginId}${path.extname(file.originalname)}`;
        cb(null, fileName)
    }
})

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/scholarshipUploads')
    },
    filename: function (req, file, cb) {

        const fileName = `${req.session.user.loginId}${path.extname(file.originalname)}`;
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage });
const upload1 = multer({ storage: storage1 });

app.use(express.static('public'));

app.get('/studentLogin', (req, res) => {
    return res.render('studentLogin');
})
app.post('/studentLogin', async (req, res) => {
    try {
        const data = {
            loginId: req.body.loginIdStud,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        }
        const user = await User.findOne({ loginId: data.loginId })
        if (!user) {
            const err = "Username not found !";
            return res.status(401).json({ err })
        }
        if (data.password != data.confirmPassword) {
            const err = "Password and Confirm Password do not match!";
            return res.status(400).json({ err })
        }
        const isPassswordMatch = await bcrypt.compare(data.password, user.password);
        if (!isPassswordMatch) {
            const err = "Wrong Password!";
            return res.status(400).json({ err })
        }
        req.session.user = {
            _id: user._id,
            loginId: user.loginId,
            name: user.name,
            semester: 1
        }
        return res.status(200).json({ err:"" })
    } catch (error) {
        console.log(err)
    }
})
app.get('/adminLogin', (req, res) => {
    return res.render('adminLogin');
})
app.post('/adminLogin', async (req, res) => {
    try {
        const data = {
            adminId: req.body.loginIdAdmi,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        }
        const admin = await Admin.findOne({ adminId: data.adminId })
        if (!admin) {
            const err = "Username not found! Signup now";
            return res.status(401).json({ err })
        }
        if (data.password != data.confirmPassword) {
            const err = "Password and Confirm Password do not matches";
            return res.status(400).json({ err })
        }
        const isPassswordMatch = await bcrypt.compare(data.password, admin.password);
        if (!isPassswordMatch) {
            const err = "Wrong Password!";
            return res.status(400).json({ err })
        }
        req.session.admin = {
            _id: admin._id,
            adminId: admin.adminId,
            name: admin.adminName
        }
        return res.status(200).json({ err:'' })
        // return res.render('adminHome', { name: req.session.admin.name })
    } catch (err) {
        console.log(err)
    }
})
app.get('/facultyLogin', (req, res) => {
    return res.render('facultyLogin');
})
app.post('/facultyLogin', async (req, res) => {
    try {
        const data = {
            loginId: req.body.loginIdFacl,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        }
        const faculty = await Faculty.findOne({ facultyId: data.loginId })
        if (!faculty) {
            const err = "Username not found !";
            return res.status(401).json({ err })
        }
        if (data.password != data.confirmPassword) {
            const err = "Password and Confirm Password do not matches";
            return res.status(400).json({ err })
        }
        const isPassswordMatch = await bcrypt.compare(data.password, faculty.password);
        if (!isPassswordMatch) {
            const err = "Wrong Password!";
            return res.status(400).json({ err })
        }
        console.log(faculty)
        req.session.faculty = {
            _id: faculty._id,
            loginId: faculty.facultyId,
            name: faculty.facultyName,
            course: faculty.course
        }
        return res.status(200).json({ err:'' })
        // return res.render('facultyHome', { name: req.session.faculty.name })
    } catch (err) {
        console.log(err)
    }
})
app.get('/addAdmin',(req,res)=>{
    return res.render('addAdmin');
})
app.post('/addAdmin',async (req,res)=>{
    try{
        const admin=req.body;
        const hashedPassword=await bcrypt.hash(admin.password,10);
        admin.password=hashedPassword;
        const added=Admin.create(admin);
        console.log(added)
        return res.render('messagePage',{message:"Admin Added Successfully !",newLocation:"/adminLogin"})
    }catch(err){
        console.log(err)
        return res.render('adminLogin')
    }
})

app.get('/addStudent', (req, res) => {
    try{
        return res.render('addStudent',{name:req.session.admin.name});
    }catch(err){
        console.log(err)
        return res.render("adminLogin")
    }
})
app.get('/editDetails', (req, res) => {
    try{
        return res.render('editDetails', { name: req.session.user.name })
    }catch(err){
        console.log(err)
        return res.render('studentLogin')
    }
})
app.get('/userActivity', (req, res) => {
    try{
        return res.render("userActivity",{name:req.session.user.name})
    }catch(err){
        console.log(err)
        return res.render('studentLogin')
    }
    
})
app.get('/showDetails', async (req, res) => {
try{
    const user = await User.findOne({ loginId: req.session.user.loginId })
    return res.render("showDetails", { user, name: req.session.user.name })
}catch(err){
    console.log(err)
    return res.render("studentLogin")
}
})
app.get('/facultyHome', (req, res) => {
    try{
        return res.render('facultyHome', { name: req.session.faculty.name })
    }catch(err){
        console.log(err)
        return res.render("facultyLogin")
    }
})
app.get('/submitFeedback', async (req, res) => {
    try {
        const course = await Course.find();
        const facultylist = []
        const courseList = []
        const courses = course[0].courses;
        for (let i = 0; i < courses.length; i++) {
            facultylist.push(courses[i].facultyAdvisors)
            courseList.push(courses[i].courseCode)
        }

        return res.render('submitFeedback', { name: req.session.user.name, courseList: JSON.stringify(courseList), facultylist: JSON.stringify(facultylist) })
    } catch (err) {
        console.log(err);
        return res.render("studentLogin")
    }
})
app.get('/applyScholarship', (req, res) => {
    try {

        return res.render('applyScholarship', { name: req.session.user.name })
    } catch (err) {
        console.log(err)
        return res.render("studentLogin")

    }
})
app.get('/studentHome', (req, res) => {
    try{
        return res.render('studentHome', { name: req.session.user.name })
    }catch(err){
        console.log(err);
        return res.render("studentLogin")
    }
})
app.post('/applyScholarship', upload1.single('income-proof'), async (req, res) => {
    try {
        const { loginId, fullName, dateOfBirth, gender, email, contactNumber, address, fatherName, motherName, numberOfSiblings, totalAnnualIncome, primarySourceOfIncome, otherSourcesOfIncome } = req.body;

        const application =
        {
            loginId,
            personalDetails: {
                fullName,
                dateOfBirth,
                gender,
                email,
                contactNumber,
                address,
            },
            familyDetails: {
                fatherName,
                motherName,
                numberOfSiblings,
            },
            incomeDetails: {
                totalAnnualIncome,
                primarySourceOfIncome,
                otherSourcesOfIncome,
                incomeProof: req.file.filename,
            },
            status: "Submitted"
        }

        const added = await Scholarship.create(application)
        return res.render("messagePage", { message: "Scholarship Applied Successfully !", newLocation: "/studentHome" })

    } catch (err) {
        console.log(err)
        return res.render("studentLogin")
    }
})
app.get('/viewAppliedScholarship', async (req, res) => {
    try {
        const appliedScholarship = await Scholarship.findOne({ loginId: req.session.user.loginId });
        return res.render('viewAppliedScholarship', { appliedScholarship, name: req.session.user.name })
    } catch (err) {
        console.log(err)
        return res.render("studentLogin")
    }
})
app.post('/submitFeedback', async (req, res) => {
    try {
        const formData = req.body;

        const addedFeedback = await Feedback.create(formData)
        return res.render("messagePage",{message:"Feedback Sent Successfully !",newLocation:"/studentHome"})
    } catch (err) {
        console.log("Error Occured : ", err)
        return res.render("studentLogin")
    }
})
app.get('/seeFeedback', async (req, res) => {
    try {
        const feedback = await Feedback.find();
        const thisCourseFeedback = []
        for (let i = 0; i < feedback.length; i++) {
            if (feedback[i].course === req.session.faculty.course) {
                thisCourseFeedback.push(feedback[i])
            }
        }

        return res.render('seeFeedback', { name: req.session.faculty.name, facultyName: JSON.stringify(req.session.faculty.name), course: JSON.stringify(req.session.faculty.course), thisCourseFeedback: JSON.stringify(thisCourseFeedback) });
    } catch (err) {
        res.send(err)
        return res.render("facultyLogin")
    }
})
app.get('/approveCourseAdd', async (req, res) => {
    try {
        const courses = await AddDropCourse.find();
        const cCode = req.session.faculty.course;
        const coursesToAdd = [];
        for (let i = 0; i < courses.length; i++) {
            if (courses[i].needed === 'To Add' && courses[i].courseCode === cCode) {
                coursesToAdd.push(courses[i]);
            }
        }
        console.log(coursesToAdd)
        return res.render('approveCourseAdd', { coursesToAdd, name: req.session.faculty.name });
    } catch (err) {
        console.log(err)
        return res.render("facultyLogin");
    }
})
app.get('/approveCourseDrop', async (req, res) => {
    try {
        const courses = await AddDropCourse.find();
        const cCode = req.session.faculty.course;

        const coursesToDrop = [];
        for (let i = 0; i < courses.length; i++) {
            if (courses[i].needed === 'To Drop' && courses[i].courseCode === cCode) {
                coursesToDrop.push(courses[i]);
            }
        }
        return res.render('approveCourseDrop', { coursesToDrop, name: req.session.faculty.name });
    } catch (error) {
        console.log(err)
        return res.render("facultyLogin")
    }
})
app.get('/adminActivity', (req, res) => {
    try{
        return res.render('adminHome',{name:req.session.admin.name})
    }catch(err){
        console.log(err)
        return res.render("adminLogin");
    }
})
app.get('/reviewCourseRegistered', async (req, res) => {
    try {
        const cCode = req.session.faculty.course;
        const students = await User.find();
        const list = [];
        for (let i = 0; i < students.length; i++) {
            const allCourses = students[i].courses
            for (let j = 0; j < allCourses.length; j++) {
                if (allCourses[j].courseCode === cCode) {
                    const data = {
                        _id: students[i]._id,
                        Name: students[i].name,
                        Course: cCode,
                        Branch: students[i].branch,
                        Status: allCourses[j].status
                    }
                    list.push(data);
                    break;
                }
            }

        }
        return res.render('reviewCourseRegistered', { registered: list, name: req.session.faculty.name })
    } catch (err) {
        console.log(err)
        return res.render("facultyLogin")
    }
})
app.get('/adminHome', (req, res) => {
    try{
        return res.render('adminHome',{name:req.session.admin.name})
    }catch(err){
        console.log(err)
        return res.render("adminLogin")
    }
})
app.get('/totalScholarshipSubmitted', async (req, res) => {
    try{
        const scholarshipList = await Scholarship.find();
    return res.render('totalScholarshipSubmitted', { scholarshipList, name: "Dileep" })
    }catch(err){
        console.log(err)
        return res.render("facultyLogin")
    }
})
app.get('/viewGrades', async (req, res) => {
    try{
        const student = await User.findOne({ loginId: req.session.user.loginId })
    return res.render('viewGrades', { name: req.session.user.name, student })
    }catch(err){
        console.log(err)
        return res.render("studentLogin")
    }
})
app.get('/updateGrades', async (req, res) => {
try{
    const students = await User.find();
    console.log(students)
    return res.render('updateGrades', { students, name: req.session.faculty.name })
}catch(err){
    console.log(err)
    return res.render("facultyLogin")
}
})
app.post('/update-grades', async (req, res) => {
    const { loginId, grades } = req.body;

    try {
        const student = await User.findOne({ loginId })
        const courses = student.courses;
        const lst = []
        courses.forEach((course) => {
            course.grade = grades[course.courseCode]
            lst.push(course)
        })
        const updatedCourse = await User.updateOne({ loginId },
            { $set: { courses: lst } }
        )
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
})
app.post('/update-scholarship-status', async (req, res) => {
    const { loginId, status, remarks } = req.body;

    try {
        await Scholarship.updateOne(
            { loginId: loginId },
            { $set: { status: status, remark: remarks } }
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Database update failed.' });
    }
});
app.post('/addCourse', async (req, res) => {
    try {
        const { studentName, rollNo, loginId, department, semester, semesterNumber, courseCode, offeringDepartment, courseType, reason } = req.body;
        const courseToAdd = {
            needed: "To Add",
            studentName, rollNo, loginId, department, semester, semesterNumber, courseCode, offeringDepartment, courseType, reason
        }
        const addedCourse = await AddDropCourse.create(courseToAdd);
        return res.render("messagePage",{message:"Course Added Successfully !",newLocation:"/studentActivity"})

    } catch (err) {
        console.log(err)
        return res.render("studentLogin");
    }

})
app.post('/add-course', async (req, res) => {
    const { action, loginId, course } = req.body;

    if (!loginId || !course || !action) {
        return res.status(400).send({ message: 'Invalid input. Login ID and course details are required.' });
    }
    const data = {
        courseName: course.offeringDepartment,
        courseCode: course.courseCode,
        credits: 3,
        facultyAdvisors: "Ankit Kumar",
        status: action
    }
    try {
        const student = await User.findOneAndUpdate(
            { loginId },
            { $push: { courses: data } },
            { new: true }
        );
        const studentInAddDrop = await AddDropCourse.findOneAndUpdate(
            { loginId },
            { $set: { status: data.status } },
            { new: true }
        )

        if (!student || !studentInAddDrop) {
            return res.status(404).send({ message: 'Student not found.' });
        }


        res.status(200).send({ message: 'Course added successfully.', data });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).send({ message: 'Internal server error.', error });
    }
});

app.delete('/delete-course', async (req, res) => {
    const { action, loginId, courseCode } = req.body;

    if (!loginId || !courseCode || !action) {
        return res.status(400).send({ message: 'Invalid input. Login ID and course code are required.' });
    }

    try {
        const student = await User.findOneAndUpdate(
            { loginId },
            { $pull: { courses: { courseCode } } },
            { new: true }
        );

        const studentInAddDrop = await AddDropCourse.findOneAndUpdate(
            { loginId },
            { $set: { status: action } },
            { new: true }
        )

        if (!student || !studentInAddDrop) {
            return res.status(404).send({ message: 'Student not found.' });
        }


        res.status(200).send({ message: 'Course deleted successfully.', student });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send({ message: 'Internal server error.', error });
    }
});


app.post('/update-course-status', async (req, res) => {
    const { _id, courseCode, status } = req.body;

    console.log("Received request data:", req.body);

    if (!_id || !courseCode || !status) {
        console.log("Invalid input. Missing fields.");
        return res.status(400).send({ message: 'Invalid input. Ensure all fields are provided.' });
    }

    try {
        const student = await User.findOneAndUpdate(
            { _id, "courses.courseCode": courseCode },
            { $set: { "courses.$.status": status } },
            { new: true }
        );

        if (!student) {
            console.log("Student or course not found.");
            return res.status(404).send({ message: 'Student or course not found.' });
        }

        console.log("Update successful:", student);
        res.send({ message: 'Course status updated successfully.', student });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send({ message: 'Error updating course status.', error });
    }
});
app.get('/facultyActivity', (req, res) => {
    try{
        return res.render('facultyActivity', { name: req.session.faculty.name })
    }catch(err){
        console.log(err)
        return res.render("facultyLogin")
    }
})
app.get('/addFaculty', (req, res) => {
    try{
        return res.render('addFaculty',{name:req.session.admin.name});
    }catch(err){
        console.log(err)
        return res.render("adminLogin")
    }
})

app.post('/addFaculty', async (req, res) => {
    try {
        const { facultyId, facultyName, email, password, course } = req.body;
        const newFaculty = { facultyId, facultyName, email, password, course };
        const hashPassword = await bcrypt.hash(newFaculty.password, 10);
        newFaculty.password = hashPassword;
        const savedFaculty = await Faculty.create(newFaculty)
        return res.render("messagePage",{message:"Faculty Added Successfully !",newLocation:"/adminActivity"})
    } catch (err) {
        console.log("Error Occured : ", err)
        return res.render("adminLogin")
    }
})

app.post('/dropCourse', async (req, res) => {
    try {
        const { studentName, rollNo, loginId, department, semester, semesterNumber, courseCode, reason, offeringDepartment } = req.body;
        const courseToDelete = {
            needed: "To Drop",
            studentName, rollNo, loginId, department, semester, semesterNumber, courseCode, reason, offeringDepartment
        }
        const deletedCourse = await AddDropCourse.create(courseToDelete)
        return res.render("messagePage",{message:"Form Submitted Successfully !",newLocation:"/userActivity"})

    } catch (err) {
        console.log(err)
        return res.render("studentLogin")
    }
})


app.get('/registerCourse', async (req, res) => {
try{
    const course = await Course.findOne({ semester: req.session.user.semester });
    const courseDetails = course.courses;
    const electiveCourses = [];
    const coreCourses = []
    for (let i = 0; i < courseDetails.length; i++) {
        if (courseDetails[i].courseType == 'Core') {
            coreCourses.push(courseDetails[i]);
        }
        else {
            electiveCourses.push(courseDetails[i])
        }
    }

    return res.render("registerCourse", { name: req.session.user.name, coreCourses, electiveCourses: JSON.stringify(electiveCourses) });
}catch(err){
    console.log(err)
    return res.render("studentLogin")
}
})

app.post('/registerCourse', async (req, res) => {
    try {
        const courseData = req.body;
        const totalCourse = [];

        for (const key in courseData) {
            if (key.startsWith('courseType')) {
                const index = key.match(/\d+/)[0];

                if (courseData[key] === 'Core') {
                    const coreCourse = {
                        courseType: "Core",
                        courseName: courseData[`courseName${index}`],
                        courseCode: courseData[`courseCode${index}`],
                        credits: courseData[`credits${index}`],
                        facultyAdvisors: courseData[`facultyAdvisors${index}`],
                        status: courseData[`status${index}`]
                    };

                    totalCourse.push(coreCourse);
                }
            }
        }

        for (const key in courseData) {
            const electiveMatch = key.match(/elective([a-zA-Z]+)\[(\d+)\]/);

            if (electiveMatch) {
                const field = electiveMatch[1];
                const id = electiveMatch[2];

                const courseCodeKey = `electiveCourseCode[${id}]`;

                let elective = totalCourse.find(course => course.courseCode === courseData[courseCodeKey]);

                if (!elective) {
                    elective = {
                        courseType: "Elective",
                        courseName: courseData[`electiveCourseName[${id}]`],
                        courseCode: courseData[courseCodeKey],
                        credits: courseData[`electiveCredits[${id}]`],
                        facultyAdvisors: courseData[`electiveFacultyAdvisors[${id}]`],
                        status: courseData[`electiveStatus[${id}]`]
                    };

                    totalCourse.push(elective);
                } else {
                    elective[field] = courseData[key];
                }
            }
        }


        const finalTotalCourseList = totalCourse;

        const student = await User.findOne({ loginId: req.session.user.loginId });
        const updatedData = await User.findByIdAndUpdate(
            student._id,
            { $set: { courses: finalTotalCourseList } },
            { new: true }
        );

        return res.redirect('/registrationHistory')


    } catch (err) {
        console.log(err)
        return res.render({studentLogin})
    }
});




app.get('/registrationHistory', async (req, res) => {
    try {
        const user = await User.findOne({ loginId: req.session.user.loginId })
        const courseDetails = user.courses;
        return res.render("registrationHistory", { name: req.session.user.name, courseDetails });
    } catch (err) {
        console.log(err)
        return res.render('studentLogin')
    }
})

app.get('/addCourse', (req, res) => {
    try{
        return res.render("addCourse", { name: req.session.user.name })
    }catch(err){
        console.log(err)
        return res.render("studentLogin")
    }
})
app.get('/dropCourse', (req, res) => {
    try{
        return res.render("dropCourse", { name: req.session.user.name });
    }catch(err){
        console.log(err)
        return res.render('studentLogin')
    }
})
app.get('/course', async (req, res) => {

    try{
        return res.render('course', { name: req.session.admin.name });
    }catch(err){
        console.log(err)
        return res.render("adminLogin")
    }
})

app.post("/Studentlogout", (req, res) => {
    try {
        if (req.session.user.name) {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Unable to log out", err);
                    return res.status(500).json({ success: false, message: "Unable to logout. Please try again later." });
                }
                res.clearCookie("connect.sid");
                res.json({ success: true, message: "Logged out successfully", redirectTo: "/studentLogin" });
            });
        }
    } catch (err) {
        res.send("Error Occured : ", err);
    }
});
app.post("/Facultylogout", (req, res) => {
    try {
        if (req.session.faculty.name) {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Unable to log out", err);
                    return res.status(500).json({ success: false, message: "Unable to logout. Please try again later." });
                }
                res.clearCookie("connect.sid");
                res.json({ success: true, message: "Logged out successfully", redirectTo: "/facultyLogin" });
            });
        }
    } catch (err) {
        res.send("Error Occured : ", err);
    }
});
app.post("/Adminlogout", (req, res) => {
    try {
        if (req.session.admin.name) {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Unable to log out", err);
                    return res.status(500).json({ success: false, message: "Unable to logout. Please try again later." });
                }
                res.clearCookie("connect.sid");
                res.json({ success: true, message: "Logged out successfully", redirectTo: "/adminLogin" });
            });
        }
    } catch (err) {
        res.send("Error Occured : ", err);
    }
});
app.post('/course', async (req, res) => {
    try {
        const { semester, courses } = req.body;
        if (!semester || !Array.isArray(courses) || courses.length === 0) {
            return res.status(400).send('Invalid data');
        }
        const findedCourse = await Course.findOne({ semester })
        let addedData = '';
        if (findedCourse) {
            addedData = findedCourse;
        } else {
            addedData = await Course.create(req.body);
        }
        const students = await User.find();
        const course1 = await Course.find();
        const allCourse = course1[0].courses;
        const crc = [];
        for (let i = 0; i < allCourse.length; i++) {
            if (allCourse[i].courseType == 'Core') {
                crc.push(allCourse[i]);
            }
        }


        students.forEach(async (student) => {
            const updatedData = await User.findByIdAndUpdate(
                student._id,
                {
                    $set: { courses: crc }
                },
                { new: true }
            );
        });
        return res.render("messagePage",{message:"Course Added Successfully !",newLocation:"/adminActivity"})
    } catch (err) {
        console.log(err)
        return res.render("adminLogin")
    }
});
app.post('/editDetails', upload.single('profilePic'), async (req, res) => {
    try {
        const studentData = req.body;
        const newStudent = {
            profilePic: req.file.filename,
            personalDetails: {
                studentName: studentData.studentName,
                fatherName: studentData.fatherName,
                rollNo: studentData.rollNo,
                dateOfBirth: studentData.dateOfBirth,
                email: studentData.email,
                alternateEmail: studentData.alternateEmail || '',
                mobileNo: studentData.mobileNo,
                alternateMobileNo: studentData.alternateMobileNo || '',
                motherTongue: studentData.motherTongue,
                bloodGroup: studentData.bloodGroup,
                abcId: studentData.abcId,
                gender: studentData.gender,
                isPhysicallyChallenged: studentData.isPhysicallyChallenged,
                phDescription: studentData.phDescription || '',
                nationality: studentData.nationality,
                religion: studentData.religion,
                maritalStatus: studentData.maritalStatus,
                guardianDetails: {
                    guardianName: studentData.guardianName,
                    relationWithGuardian: studentData.relationWithGuardian,
                    guardianMobileNo: studentData.guardianMobileNo
                },
                emergencyContact: {
                    name: studentData.emergencyContactPersonName,
                    relation: studentData.relationWithEmergencyContactPerson,
                    mobileNo: studentData.emergencyContactPersonNumber
                },
                incomePerAnnum: studentData.incomePerAnnum
            },
            addressDetails: {
                addressType: studentData.addressType,
                country: studentData.country,
                state: studentData.state,
                fromDate: studentData.fromDate,
                zipCode: studentData.zipCode,
                address: studentData.address
            },
            studentDegreeDetails: {
                branch: studentData.Branch,
                branchFromDate: studentData.branchFromDate,
                studentType: studentData.studentType,
                sponsoredOrganizationName: studentData.sponsoredOrgName || '',
                fundingSource: studentData.fundingSource || '',
                projectName: studentData.projectName || ''
            },
            degreeDetails: {
                degreeName: studentData.degreeName,
                curriculumName: studentData.curriculumName,
                batchName: studentData.batchName,
                degreeStatus: studentData.degreeStatus,
                degreeFromDate: studentData.degreeFromDate,
                degreeToDate: studentData.degreeToDate || null,
                remarks: studentData.remarks || ''
            }
        }

        const user = await User.findOne({ loginId: req.session.user.loginId })
        const updateUser = await User.findByIdAndUpdate(user._id, { $set: newStudent }, { new: true, runValidators: true })
        return res.redirect('/showDetails')

    } catch (err) {
        console.log(err)
        return res.redirect("studentLogin")
    }
})
app.post('/addStudent', async (req, res) => {
    try {
        const data = {
            loginId: req.body.loginIdStud,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            branch: req.body.branch,
            rollNo: req.body.rollNo,
            personalDetails: {
                studentName: req.body.name || '',
                rollNo: req.body.rollNo || undefined,
            },
        }
        const hashPassword = await bcrypt.hash(data.password, 10);
        data.password = hashPassword;
        const addedData = await User.create(data);
        return res.render("messagePage", { message: "Student Added Successfully !", newLocation: "/adminActivity" })
    } catch (err) {
       console.log(err)
       return res.render("adminLogin")
    }

})



const port = 5000;
app.listen(port, () => {
    console.log("Server started running...")
})
