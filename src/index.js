require('dotenv').config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const route = require("./routes/route")
const multer = require("multer")

app.use(express.json())
app.use(multer().any())
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT
const MONGODB_URL = process.env.DATABASE_URL

mongoose.connect(MONGODB_URL)
    .then(()=> console.log("MongoDB is connected"))
    .catch((err) => console.log(err))

app.use('/', route)

app.listen(PORT, () => {console.log('Express is running on port ' + PORT)})