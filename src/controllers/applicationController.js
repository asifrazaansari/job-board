const application = require('../models/applicationModel')
const Job = require("../models/jobModel")
const { uploadFile } = require("../utils/aws")
const { isvalidEmail, nameRegex, isValidResume, isValidCoverLetter } = require('../validators/validator')

const applyJob = async (req, res) => {
    try {
        const data = req.body
        const { fname, lname, email } = data
        const files = req.files
        const decoded = req.decodedToken

        const applied = await application.findOne({ job: req.params.id, user: decoded.userId })

        if (applied) {
            return res.status(400).send({ message: 'Already applied' });
        }

        //validations
        const findJob = await Job.findOne({ _id: req.params.id, isDeleted: false });

        if (decoded.userId.toString() === findJob.user.toString()) {
            return res.status(400).send({ message: 'You created this job, so please!' });
        }

        if (!findJob) return res.status(404).send({ status: false, message: "No job found with this Id, please check again" });

        data.job = findJob._id
        data.user = decoded.userId
        data.isDeleted = false

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
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const findJob = await Job.findOne({ _id: req.params.id, isDeleted: false });
        if (!findJob) return res.status(404).send({ status: false, message: "No job found with this Id, please check again" });

        if (findJob.user.toString() !== decoded.userId) return res.status(403).send({ status: false, message: "You are not authorised" });

        const allApplicant = await application.find({ job: findJob._id }).skip((page - 1) * limit).limit(limit)
        if (!allApplicant) return res.status(404).send({ status: false, message: "No applicant found" });

        return res.status(200).send({ status: true, message: "All applicant", count: allApplicant.length, data: allApplicant })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

const updateApplication = async (req, res) => {
    try {
        const data = req.body
        const { fname, lname, email } = data
        const files = req.files

        const decoded = req.decodedToken

        const applicant = await application.findOne({ _id: req.params.id, isDeleted: false });
        if (!applicant) return res.status(404).send({ status: false, message: "No application found with this Id, please check again" });

        const appWithJob = await Job.findById(applicant.job)
        if (!appWithJob) return res.status(404).send({ status: false, message: "No application found" });

        if (appWithJob.user.toString() !== decoded.userId) return res.status(403).send({ status: false, message: "You are not authorised" });
        //validations

        if (fname) {
            if (!nameRegex(fname)) return res.status(400).send({ status: false, message: "fname must be present and in correct format" });
            applicant.fname = fname
        }

        if (lname) {
            if (!nameRegex(lname)) return res.status(400).send({ status: false, message: "lname must be present and in correct format" });
            applicant.lname = lname
        }

        if (email) {
            if (!isvalidEmail(email)) return res.status(400).send({ status: false, message: "email must be present and valid" });
            applicant.email = email
        }

        //validations for files
        if (files && files.length > 0) {
            if (isValidResume(files[0].mimetype)) {
                const uploadedResume = await uploadFile(files[0])
                applicant.resume = uploadedResume
            } else {
                return res.status(400).send({ status: false, message: "resume should be  in pdf or doc format" })
            }

        }

        if (files && files.length > 1) {
            if (isValidCoverLetter(files[1].mimetype)) {
                const uploadedCL = await uploadFile(files[1])
                applicant.coverLetter = uploadedCL
            } else {
                return res.status(400).send({ status: false, message: "coverLetter should be  in markdown format" })
            }
        }

        await applicant.save()

        return res.status(200).send({ status: true, message: "Application successfully updated", data: applicant })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

const deleteApplication = async (req, res) => {
    try {
        const decoded = req.decodedToken

        const applicant = await application.findOne({ _id: req.params.id, isDeleted: false });
        if (!applicant) return res.status(404).send({ status: false, message: "No applicant found with this Id, please check again" });

        const appWithJob = await Job.findById(applicant.job)
        if (!appWithJob) return res.status(404).send({ status: false, message: "No applicant found" });

        if (appWithJob.user.toString() !== decoded.userId) return res.status(403).send({ status: false, message: "You are not authorised" });

        applicant.isDeleted = true
        await applicant.save()

        return res.status(200).send({ status: true, message: "successfully deleted" })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

module.exports = { applyJob, getApplications, updateApplication, deleteApplication }