const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is compulsory."]
    },
    loginId: {
        type: Number,
        required: [true, "Login Id is compulsory."],
        unique: true 
    },
    email: {
        type: String,
        required: [true, "Email is compulsory."]
    },
    password: {
        type: String,
        required: [true, "Password is compulsory."]
    },
    branch: {
        type: String,
        required: [true, "Branch is compulsory"]
    },
    rollNo: {
        type: Number,
        required: [true, "Roll no is compulsory"],
        unique:true
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    profilePic:{
        type:String, 
        default:"user.png"
    },
    personalDetails: {
        studentName: { type: String},
        fatherName: { type: String },
        rollNo: { type: Number, unique:true},
        dateOfBirth: { type: Date},
        email: { type: String},
        alternateEmail: { type: String },
        mobileNo: { type: Number},
        alternateMobileNo: { type: Number },
        motherTongue: { type: String},
        bloodGroup: { type: String },
        abcId: { type: String },
        gender: { type: String },
        isPhysicallyChallenged: { type: String },
        phDescription: { type: String },
        nationality: { type: String},
        religion: { type: String},
        maritalStatus: { type: String},
        guardianDetails: {
            guardianName: { type: String },
            relationWithGuardian: { type: String},
            guardianMobileNo: { type: Number },
        },
        emergencyContact: {
            name: { type: String },
            relation: { type: String},
            mobileNo: { type: Number },
        },
        incomePerAnnum: { type: Number},
    },
    addressDetails: {
        addressType: { type: String },
        country: { type: String },
        state: { type: String},
        fromDate: { type: Date },
        zipCode: { type: Number },
        address: { type: String },
    },
    studentDegreeDetails: {
        branch: { type: String },
        branchFromDate: { type: Date },
        studentType: { type: String },
        sponsoredOrganizationName: { type: String },
        fundingSource: { type: String },
        projectName: { type: String },
    },
    degreeDetails: {
        degreeName: { type: String },
        curriculumName: { type: String },
        batchName: { type: String },
        degreeStatus: { type: String },
        degreeFromDate: { type: Date },
        degreeToDate: { type: Date },
        remarks: { type: String },
    },
    courses: [{
        courseName: {
            type: String,
        },
        courseCode: {
            type: String,
        },
        credits: {
            type: Number,
        },
        facultyAdvisors: {
            type: String,
  
        },
        status: { 
            type: String, 
            default: "Pending" 
        },
        grade:{type:String, default:''}
    }]
});

const User = mongoose.model('Student', userSchema);

module.exports = User;
