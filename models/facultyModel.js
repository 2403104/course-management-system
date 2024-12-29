const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    facultyId: {
        type: String,
        required: true,
        unique: true,
    },
    facultyName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8 
    },
    course: {
        type: String,
        required: true,
    }

});

const Faculty= mongoose.model('faculty',facultySchema)
module.exports = Faculty
