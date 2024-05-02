const { UserModel }= require('../model/user.model');
const bcrypt = require('bcryptjs');
const dotenv=require("dotenv")
const jwt = require('jsonwebtoken');
const express = require('express')
dotenv.config()
const userRoute = express.Router();

userRoute.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ msg: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ message: 'User registered successfully', token, username: newUser.username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

userRoute.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ msg: 'User logged in successfully', username: user.username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = {
    userRoute
}
