const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { isvalidEmail, isvalidPass, nameRegex } = require('../validators/validator')

const createUser = async (req, res) => {
    try {
        const data = req.body

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "required field can't be empty" })

        //validations
        if (!nameRegex(data.name)) return res.status(400).send({ status: false, message: "name must be present and in correct format" });
        if (!isvalidEmail(data.email)) return res.status(400).send({ status: false, message: "email must be present and valid" });
        const user = await User.findOne({ email: data.email });
        if (user) {
            return res.status(400).send({ message: 'User already exists' });
        }
        if (!isvalidPass(data.password)) return res.status(400).send({ status: false, msg: "Password must be present in between 8 to 15 mixed with upper, lower and symbol letter" });


        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword

        const saveData = await User.create(data);
        return res.status(201).send({ status: true, message: "User created successfully", data: saveData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};



const loginUser = async (req, res) => {
    try {
        const user = req.body;
        if (Object.keys(user).length === 0) return res.status(400).send({ status: false, message: "enter a field to login" });

        const { email, password } = user

        if (!isvalidEmail(email)) return res.status(400).send({ status: false, message: "email must be present and valid" });
        if (!isvalidPass(password)) return res.status(400).send({ status: false, message: "Please Enter Your's Password" });

        const loggedInUser = await User.findOne({ email: email })
        if (!loggedInUser) return res.status(404).send({ status: false, message: "No user Found With The Input Credentials, Please Confirm The Credentials" })

        const isValidPassword = await bcrypt.compare(password.trim(), loggedInUser.password);
        if (!isValidPassword) return res.status(400).send({ status: false, message: "Password is not correct" });

        const token = jwt.sign({ userId: loggedInUser._id, userName: loggedInUser.name }, "assignJob", { expiresIn: '24h' });
        const data = { userId: loggedInUser._id, token: token, userName: loggedInUser.name }
        return res.status(200).send({ status: true, message: "Success", data: data })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createUser, loginUser }