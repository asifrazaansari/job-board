const express = require('express')
const router = express.Router()

//=========================controllers require==========================//
const { postJob } = require('../controllers/recruiterController')
const { listJob, applyJob } = require('../controllers/userController')

//================middlewares, validation===============================//
const { authentication, authorization } = require('../middlewares/auth')



//===============================recruiter routes=======================//
router.post('/postJob', postJob)

//============================user routes=============================//
router.get('/listJob', listJob)
router.post('/applyJob', applyJob)


router.all('/*', (req, res) => {
    return res.status(400).send({ status: false, message: "Page not found" })
})

module.exports = router