const mongoose=require('mongoose')
const feedbackSchema=new mongoose.Schema({
    course: { type: String, required: true }, 
    faculty: { type: String, required: true },
    coursePlanPresentation: { 
        type: String, 
        enum: ['Poor', 'Average', 'Good', 'Very Good', 'Excellent', 'No Opinion'], 
        required: true 
    },
    courseObjectives: { 
        type: String, 
        enum: ['Poor', 'Average', 'Good', 'Very Good', 'Excellent', 'No Opinion'], 
        required: true 
    },
    lectureClarity: { 
        type: String, 
        enum: ['Poor', 'Average', 'Good', 'Very Good', 'Excellent', 'No Opinion'], 
        required: true 
    },
    learningEffectiveness: { 
        type: String, 
        enum: ['Poor', 'Average', 'Good', 'Very Good', 'Excellent', 'No Opinion'], 
        required: true 
    },
    workloadRating: { 
        type: String, 
        enum: ['Just Right', 'Too Light', 'Too Heavy', 'No Opinion'], 
        required: true 
    },
    likeMostCourse: { type: String, default: '' },
    likeMosttutorial: { type: String, default: '' },
    dislikeMostCourse: { type: String, default: '' },
    dislikeMosttutorial: { type: String, default: '' }
});

const Feedback=mongoose.model('feedback',feedbackSchema)

module.exports=Feedback;