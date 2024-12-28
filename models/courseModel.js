const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseType:{
        type:String,
        required:true
    },
    courseName: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    facultyAdvisors: {
        type: String,
        required: true
    },
    status:{
        type:String,
        default:"Pending"
    }
});

const courseRegistrationSchema = new Schema({
    semester: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5, 6, 7, 8] 
    },
    courses: [courseSchema] 
});

const CourseRegistration = mongoose.model('CourseRegistration', courseRegistrationSchema);

module.exports = CourseRegistration;
