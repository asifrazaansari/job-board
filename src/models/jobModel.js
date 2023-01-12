const mongoose = require('mongoose')
const ObjectId =  mongoose.Schema.Types.ObjectId

const jobSchema = new mongoose.Schema({
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
    skills: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: ObjectId,
        ref: 'User'
    }

}, {timestamps: true});

module.exports = mongoose.model('jobList', jobSchema)