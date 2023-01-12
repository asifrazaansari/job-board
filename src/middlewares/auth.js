const jwt = require('jsonwebtoken')

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

module.exports = { authentication }