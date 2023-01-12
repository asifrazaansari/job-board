const jobModel = require("../models/jobModel")
const job = require("../models/jobModel")
const { isvalidEmail, isValidString } = require('../validators/validator')


const postJob = async (req, res) => {
    try {
        const data = req.body
        const decoded = req.decodedToken
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "required field can't be empty" })

        const { title, description, email, skills, experience } = data
        data.user = decoded.userId
        data.isDeleted = false
        //=================================Validations===========================================//
        if (!isValidString(title)) return res.status(400).send({ status: false, message: "title should be present and valid" })
        if (!isValidString(description)) return res.status(400).send({ status: false, message: "description should be present and valid" })
        if (!isvalidEmail(email)) return res.status(400).send({ status: false, message: "email should be present and valid" })
        if (!isValidString(skills)) return res.status(400).send({ status: false, message: "skills should be valid" })
        if (!isValidString(experience)) return res.status(400).send({ status: false, message: "experience should be valid" })


        const createJob = await job.create(data)
        return res.status(201).send({ status: true, message: "Job successfully posted", data: createJob })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

const getJob = async (req, res) => {
    try {
        const data = req.query
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        if (Object.keys(data).length === 0) {
            const allJobs = await job.find({ isDeleted: false })
            return res.status(200).send({ status: true, message: "All Jobs", count: allJobs.length, data: allJobs })
        }

        const filter = { isDeleted: false }

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

        const allPosting = await job.find(filter).skip((page - 1) * limit).limit(limit).select({ user: 0 })
        if (allPosting.length === 0) return res.status(404).send({ status: false, message: "No jobs found, come later" });

        return res.status(200).send({ status: true, message: "Success", count: allPosting.length, data: allPosting });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}


const getJobById = async (req, res) => {
    try {
        const Job = await job.findOne({ _id: req.params.id, isDeleted: false });
        if (!Job) {
            return res.status(404).send({ status: false, message: "No jobs found, come later" });
        }
        return res.status(200).send({ status: true, message: "Success", data: Job });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

const updateJob = async (req, res) => {
    try {
        const data = req.body
        const decoded = req.decodedToken

        const findJob = await job.findOne({ _id: req.params.id, isDeleted: false });
        if (!findJob) return res.status(404).send({ status: false, message: "No job found with this Id, please check again" });

        if (findJob.user.toString() !== decoded.userId) return res.status(403).send({ status: false, message: "You are not authorised" });


        let { title, description, email, skills, experience } = data

        if (title) {
            if (!isValidString(title)) return res.status(400).send({ status: false, message: "title should be valid string" })
            findJob.title = title;
        }

        if (description) {
            if (!isValidString(description)) return res.status(400).send({ status: false, message: "description should be valid string" })
            findJob.description = description;
        }

        if (email) {
            if (!isvalidEmail(email)) return res.status(400).send({ status: false, message: "email should be valid" })
            findJob.email = email;
        }

        if (skills) {
            if (!isValidString(skills)) return res.status(400).send({ status: false, message: "skills should be valid" })
            findJob.skills = skills;
        }

        if (experience) {
            if (!isValidString(experience)) return res.status(400).send({ status: false, message: "experience should be valid" })
            findJob.experience = experience;
        }


        await findJob.save()

        return res.status(200).send({ status: true, message: "Job successfully updated", data: findJob })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

const deleteJob = async (req, res) => {
    try {
        const decoded = req.decodedToken

        const findJob = await job.findOne({ _id: req.params.id, isDeleted: false });
        if (!findJob) return res.status(404).send({ status: false, message: "No job found with this Id, please check again" });

        if (findJob.user.toString() !== decoded.userId) return res.status(403).send({ status: false, message: "You are not authorised" });

        findJob.isDeleted = true
        await findJob.save()

        return res.status(200).send({ status: true, message: "successfully deleted" })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}


module.exports = { postJob, getJob, getJobById, updateJob, deleteJob }

