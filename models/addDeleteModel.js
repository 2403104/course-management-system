const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddCourseSchema = new Schema({
    needed:{
        type:String,
        required:true
    },
    studentName: {
        type: String,
        required: true
    },
    rollNo: {
        type: Number,
        required: true
    },
    loginId: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['CSE', 'EE', 'ME', 'M$C'] 
    },
    semester: {
        type: String,
        required: true,
        enum: ['spring', 'autumn'] 
    },
    semesterNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 8 
    },
    courseCode: {
        type: String,
        required: true,
        enum: ['CS570', 'CS572', 'CS462', 'CS611', 'CS520', 'CS511', 'CS521', 'CS513','MA101','CS101','NO101','CH102','PH101','HS102'] 
    },
    offeringDepartment: {
        type: String,
        enum: [
            'Model Checking and Software Verification',
            'Modeling and Simulation of Systems',
            'Markov chains and their Applications',
            'Computational Complexity',
            'Combinatorial Optimization',
            'Approaches to Software Performance Enhancement',
            'Foundations of Functional Programming',
            'Introduction to Information Security',
            'INTRODUCTION TO CALCULUS',
            'INTRODUCTION TO COMPUTING',
            'SPORTS',
            'ORGANIC AND INORGANIC CHEMISTRY',
            'QUANTUM PHYSICS',
            'HUMANITY AND SOCIAL STUDIES'
        ]
    },
    courseType: {
        type: String,
        enum: ['core', 'elective', 'openElective', 'interdisciplinary'] 
    },
    reason:{type:String, required:true},
    status:{type:String, default:"Pending"}
});



const AddDeleteCourse = mongoose.model('dropaddcourse', AddCourseSchema);


module.exports = AddDeleteCourse;
