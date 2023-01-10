const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const { validateObjectId } = require('../validators/validator')

const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(400).send({ status: false, message: "token is not present" })
        token = token.split(" ")
        if (!token[1]) return res.status(400).send({ status: false, message: "token is not present" })
        jwt.verify(token[1], "assignJob", (error, decodedToken) => {
            if (error) return res.status(401).send({ status: false, message: "Token is invalid" })
            else {
                req.decodedToken = decodedToken
                next()
            }
        })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

const authorization = async (req, res, next) => {
    try {
        const decoded = req.decodedToken
        const paramsUserId = req.params.userId
        if (!validateObjectId(paramsUserId)) return res.status(400).send({ status: false, msg: "please enter valid userId" })

        const userLoggedIn = decoded.userId
        const user = await userModel.findById(paramsUserId)
        if (!user) return res.status(404).send({ status: false, message: "user not Found" })

        if (user._id.toString() !== userLoggedIn) {
            return res.status(403).send({ status: false, message: "Not authorised" })
        }
        next()

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

module.exports = { authentication, authorization }