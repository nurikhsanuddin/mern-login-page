const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const e = require('express');

//register user
const registerUser = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        // Validate all required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }

        // Validate password requirements
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if email already exists - only check once
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({message: 'User created successfully'});
    } catch(error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Registration failed', 
            error: error.message
        });
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body; 
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({message: 'Please provide email and password'});
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response with token and user data (excluding password)
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userData
        });
    } catch(error) {
        console.error('Login error:', error);
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

module.exports = {registerUser, loginUser};