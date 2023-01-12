const application = require('../models/applicationModel')
const Job = require("../models/jobModel")
const { uploadFile } = require("../utils/aws")
const { isvalidEmail, nameRegex, isValidResume, isValidCoverLetter, validateObjectId } = require('../validators/validator')

const applyJob = async (req, res) => {
    try {
        const data = req.body
        const { fname, lname, email } = data
        const files = req.files

        //validations
        const findJob = await Job.findById(req.params.id)
        if(!findJob) return res.status(404).send({ status: false, message: "No job found with this Id, please check again" });
        data.job = findJob._id

        if (!nameRegex(fname)) return res.status(400).send({ status: false, message: "fname must be present and in correct format" });
        if (!nameRegex(lname)) return res.status(400).send({ status: false, message: "lname must be present and in correct format" });
        if (!isvalidEmail(email)) return res.status(400).send({ status: false, message: "email must be present and valid" });
    
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
            return res.status(400).send({ status: false, message: "resume and coverletter must be present" })
        }

        const saveData = await application.create(data)
        return res.status(201).send({ status: true, message: "Applied successfully", data: saveData })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

const getApplications = async (req, res) => {
    try {
        const decoded = req.decodedToken

        const findJob = await Job.findById(req.params.id)
        if(!findJob) return res.status(404).send({ status: false, message: "No job found with this Id, please check again" });

        if(findJob.user.toString() !== decoded.userId) return res.status(403).send({ status: false, message: "You are not authorised" });

        const allApplicant = await application.find({job: findJob._id})
        if(!allApplicant) return res.status(404).send({ status: false, message: "No applicant found" });

        return res.status(200).send({ status: true, message: "All applicant", count: allApplicant.length, data: allApplicant })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

module.exports = { applyJob, getApplications }