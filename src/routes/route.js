const express = require('express')
const router = express.Router()

//=========================controllers require==========================//
const {} = require('../controllers/recruiterController')
const {} = require('../controllers/userController')

//================middlewares, validation===============================//



//===============================recruiter routes=======================//


//============================user routes=============================//




router.all('/*', (req, res) => {
    return res.status(400).send({status: false, message: "Page not found"})
})

module.exports = router