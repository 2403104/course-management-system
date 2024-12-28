const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    loginId:{type:Number,required:true,unique:true},
    personalDetails: {
        fullName: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, enum: ['male', 'female', 'other'], required: true },
        email: { type: String, required: true },
        contactNumber: { type: String, required: true },
        address: { type: String, required: true },
    },
    familyDetails: {
        fatherName: { type: String, required: true },
        motherName: { type: String, required: true },
        numberOfSiblings: { type: Number, required: true },
    },
    incomeDetails: {
        totalAnnualIncome: { type: Number, required: true },
        primarySourceOfIncome: { type: String, required: true },
        otherSourcesOfIncome: { type: String,default:'' },
        incomeProof: { type: String, required: true }, 
    },
    status:{type:String, default:"Submitted"},
    remark:{type:String}
});

const Scholarship = mongoose.model('ScholarshipApplication', scholarshipSchema);
module.exports=Scholarship
