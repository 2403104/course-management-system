const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true,
    },
    timeTable: [
        {
            day: {
                type: String,
                required: true,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            },
            slots: {
                slot1: { course: { type: String, required: true } },
                slot2: { course: { type: String, required: true } },
                slot3: { course: { type: String, required: true } },
                slot4: { course: { type: String, required: true } },
                slot5: { course: { type: String, required: true } },
                slot6: { course: { type: String, required: true } },
                slot7: { course: { type: String, required: true } },
                slot8: { course: { type: String, required: true } },
            },
        },
    ],
});

const Timetable = mongoose.model('Timetable', TimetableSchema);
module.exports = Timetable;
