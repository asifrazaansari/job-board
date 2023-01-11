const user = require('../models/userModel')
const job = require('../models/recruiterModel')
const { uploadFile } = require("../utils/aws")
const { isvalidEmail, isvalidPass, isValidString, nameRegex, isValidResume, isValidCoverLetter } = require('../validators/validator')

const listJob = async (req, res) => {
    try {
        const data = req.query

        if (Object.keys(data).length === 0) {
            const allJobs = await job.find()
            return res.status(200).send({ status: true, message: "All Jobs", count: allJobs.length, data: allJobs })
        }

        const filter = {}

        if (data.skills) {
            if (!isValidString(data.skills)) return res.status(400).send({ status: false, message: "skills should be valid string" })
            const str = new RegExp(data.skills, 'i')
            filter.skills = { $regex: str }
        }

        if (data.experience) {
            if (!isValidString(data.experience)) return res.status(400).send({ status: false, message: "experience should be valid string" })
            const str = new RegExp(data.experience, 'i')
            filter.experience = { $regex: str }
        }

        if (data.title) {
            if (!isValidString(data.title)) return res.status(400).send({ status: false, message: "title should be valid string" })
            const str = new RegExp(data.title, 'i')
            filter.title = { $regex: str }
        }

        if (data.description) {
            if (!isValidString(data.description)) return res.status(400).send({ status: false, message: "description should be valid string" })
            const str = new RegExp(data.description, 'i')
            filter.description = { $regex: str }
        }

        if (data.email) {
            if (!isvalidEmail(data.email)) return res.status(400).send({ status: false, message: "email should be valid" })
            filter.email = data.email
        }

        const allPosting = await job.find(filter)
        if (allPosting.length === 0) return res.status(404).send({ status: false, message: "No jobs found, come later" });

        return res.status(200).send({ status: true, message: "Success", count: allPosting.length, data: allPosting });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}


const applyJob = async (req, res) => {
    try {
        const data = req.body
        const { fname, lname, email, resume, coverLetter } = data
        const files = req.files
    
        //validations
        if (!nameRegex(fname)) return res.status(400).send({ status: false, msg: "fname must be present and in correct format" });
        if (!nameRegex(lname)) return res.status(400).send({ status: false, msg: "lname must be present and in correct format" });
        if (!isvalidEmail(email)) return res.status(400).send({ status: false, msg: "email must be present and valid" });

        //validations for files
        if (files.length === 2) {
            if (files[0].fieldname === "resume") {
                if (!isValidResume(files[0].mimetype)) return res.status(400).send({ status: false, message: "resume should be  in pdf or doc format" })
                const uploadedResume = await uploadFile(files[0])
                data.resume = uploadedResume
            }

            if (files[1].fieldname === "coverLetter") {
                if (!isValidCoverLetter(files[1].mimetype)) return res.status(400).send({ status: false, message: "coverLetter should be  in markdown format" })
                const uploadedCL = await uploadFile(files[1])
                data.coverLetter = uploadedCL
            }
        }
        else {
            return res.status(400).send({ status: false, msg: "resume and coverletter must be present" })
        }

        const saveData = await user.create(data)
        return res.status(201).send({ status: true, message: "Applied successfully", data: saveData })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

module.exports = { listJob, applyJob }