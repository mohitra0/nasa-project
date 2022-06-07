const mongoose = require('mongoose');

const launchschema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },

    mission: {
        type: String,
        required: true,
    },
    Rocket: {
        type: String,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    target: {
        type: String,
    },
    customer: {
        type: [String],
        required: true,
    },
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default:true,
    },
});

module.exports= mongoose.model('Launch',launchschema);








