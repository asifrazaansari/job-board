require('dotenv').config()
const aws = require('aws-sdk')

aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
})

const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
        const s3 = new aws.S3({ apiVersion: '2006-03-01' })

        const uploadParams = {
            ACL: 'public-read',
            Bucket: 'classroom-training-bucket',
            Key: 'assignjob/' + file.originalname,
            Body: file.buffer
        }


        s3.upload(uploadParams, (err, data) => {
            if (err) return reject({ "error": err })
            return resolve(data.Location)
        })
    })
}

module.exports = { uploadFile }