const mongoose = require('mongoose')


const recruiterSchema = new mongoose.Schema({
    title: {
       type: String,
       required: true,
       trim: true 
    },
    description: {
        type: String,
        required: true,
        trim: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    skills: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    }

}, {timestamps: true});

module.exports = mongoose.model('jobList', recruiterSchema)