const mongoose = require("mongoose")
const ObjectId =  mongoose.Schema.Types.ObjectId

const applicationSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    resume: {
        type: String,
        required: true,
        trim: true
    },
    coverLetter: {
        type: String,
        required: true,
        trim: true
    },
    job: {
        type: ObjectId,
        ref: 'Job'
    },
    user: {
        type: ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

module.exports = mongoose.model('Application', applicationSchema)