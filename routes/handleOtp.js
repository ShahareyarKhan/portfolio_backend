const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');

router.post('/sendOtp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (email !== process.env.EMAIL_USER) {
        return res.status(403).json({ error: 'Email not verified by admin' });
    }

    try {
        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // Environment variable!
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP for blog deletion is: ${otp}`,
        });



        res.status(200).json({ message: 'OTP sent to email' });
    } catch (err) {
        console.error('Email send error:', err);
        res.status(500).json({ error: 'Failed to send OTP. Try again later.' });
    }
});

router.post('/verifyOtp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const storedOtp = await Otp.findOne({ email });

        if (!storedOtp) {
            return res.status(404).json({ error: 'OTP not found' });
        }

        if (storedOtp.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        res.status(200).json({ message: 'OTP verified' });
    } catch (err) {
        console.error('OTP verification error:', err);
        res.status(500).json({ error: 'Failed to verify OTP. Try again later.' });
    }
});


module.exports = router;
