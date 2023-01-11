const job = require("../models/recruiterModel")
const { isvalidEmail, isvalidPass, isValidString } = require('../validators/validator')

const postJob = async (req, res) => {
    try {
        const data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "required field can't be empty" })
       
        const { title, description, email, skills, experience } = data


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


module.exports = { postJob }

