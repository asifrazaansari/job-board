const express = require('express')
const router = express.Router()

// Controllers require
const {createUser, loginUser} = require('../controllers/userController')
const { postJob, getJob, getJobById } = require('../controllers/jobController')
const { applyJob, getApplications } = require('../controllers/applicationController')

// Middleware
const { authentication} = require('../middlewares/auth')


// User routes
router.post('/users', createUser);
router.post('/users/login', loginUser);

// Job routes
router.post('/jobs', authentication, postJob);
router.get('/jobs', getJob);
router.get('/jobs/:id', authentication, getJobById);

// Application routes
router.post('/jobs/:id/apply', authentication, applyJob);
router.get('/jobs/:id/applications', authentication, getApplications);

router.all('/*', (req, res) => {
    return res.status(400).send({ status: false, message: "Page not found" })
})

module.exports = router