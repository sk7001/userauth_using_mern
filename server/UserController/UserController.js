const UserModel = require("../Models/UserModel")
const otp_generator = require("otp-generator")
const bcrypt = require("bcrypt")
const sendEmail = require("../Emailservice/Email")
const jwt = require("jsonwebtoken")
const { response } = require("express")

const register = async (req, res) => {
    try {
        console.log(req.body);

        const isUserExisting = await UserModel.findOne({ email: req.body.email })
        if (isUserExisting) {
            console.log(`User with the email ${req.body.email} already exists`)
            return res.status(400).json({ message: `User with the email ${req.body.email} already exists` });
        }

        const verificationToken = otp_generator.generate(6, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: false, specialChars: false })

        const expires = new Date

        expires.setMinutes(expires.getMinutes() + 5)

        const hashPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = await UserModel({
            email: req.body.email,
            username: req.body.username,
            password: hashPassword,
            VerificationToken: {
                token: verificationToken,
                expires: expires
            }
        })

        console.log(newUser);

        await newUser.save()

        const emailBody = `<p> Please click on the link to verify your account. <b>http://localhost:2000/user/verify/${verificationToken}</b></p>`;
        const subject = 'Verification Email'
        await sendEmail(req.body.email, subject, emailBody).then(response => {
            console.log('Email sent successfully:', response);
        }).catch(error => {
            console.error('Error sending email:', error);
        });

        res.json("User saved succssfully");
    } catch (error) {
        res.json(error)
    }
}

const login = async (req, res) => {
    try {
        console.log(req.body)
        const isUserExisting = await UserModel.findOne({ email: req.body.email })
        console.log(isUserExisting)
        if (!isUserExisting) {
            if (req.body.autoGenerated) {

                const password = otp_generator.generate(12, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: true })
                const hashPassword = await bcrypt.hash(password, 10)

                const newUser = await UserModel({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashPassword,
                    isVerified: true
                })
                await newUser.save()
                const emailBody = `<p>Account created successfully.</p>
                </br>
                <p>Your password is ${password} `;
                const subject = 'Account created via Social Account'
                await sendEmail(req.body.email, subject, emailBody).then(response => {
                    console.log('Email sent successfully:', response);
                }).catch(error => {
                    console.error('Error sending email:', error);
                });
                const jwtPayload = {
                    id: newUser._id,
                }
                const token = jwt.sign(jwtPayload, process.env.SECRET, { expiresIn: '24h' })
                console.log(token)
                return res.status(200).json({ message: `Welcome, ${newUser.username}`, token });

            }
            return res.status(400).json({ message: `User with the email ${req.body.email} doesn't exist.` });
        }
        if (!isUserExisting.isVerified) {
            return res.status(400).json({ message: `User with the email ${req.body.email}is not verified. Please click the link in the email sent to you to verify.` })
        }
        if (!req.body.autoGenerated) {
            const isPasswordValid = await bcrypt.compare(req.body.password, isUserExisting.password)
            if (!isPasswordValid) {
                return res.status(400).json({ message: `Invalid Password` });
            }
        }
        //generate JWT token

        const jwtPayload = {
            id: isUserExisting._id,
        }
        console.log(jwtPayload)
        const token = jwt.sign(jwtPayload, process.env.SECRET, { expiresIn: '24h' })
        const emailBody = `New Login detected at ${Date.now()}`;
        const subject = 'Login detected.'
        await sendEmail(isUserExisting.email, subject, emailBody).then(response => {
            console.log('Email sent successfully:', response);
        }).catch(error => {
            console.error('Error sending email:', error);
        });
        console.log(token)

        return res.status(200).json({ message: `Welcome, ${isUserExisting.username}`, token });
    } catch (error) {
        res.json(error)
    }
}

const verifyUser = async (req, res) => {
    try {
        console.log(req.params);
        const { token } = req.params
        const isTokenValid = await UserModel.findOne(
            {
                "VerificationToken.token": token,
                'VerificationToken.expires': { $gt: new Date() }
            });
        console.log(isTokenValid);
        if (isTokenValid) {
            isTokenValid.isVerified = true
            res.send(`Your email has been verified. Please login to continue.<a href="http://localhost:3000/signup">Login</a>`);
        }
        else {
            res.send(`Link has been expired. Please signup again to continue.<a href="http://localhost:2000/user/resendVerification/${token}">Resend Verification Mail</a>`)
            return res.status(400).json({ message: "Token ivalid or expired" })
        }
        await isTokenValid.save()
    } catch (error) {
        console.log(error)
    }
}

const resendVerification = async (req, res) => {
    try {
        const { token } = req.params
        const user = await UserModel.findOne({
            "VerificationToken.token": token,
            "isVerified": false
        });
        if (user) {
            const verificationToken = otp_generator.generate(6, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: false, specialChars: false })
            const expires = new Date
            expires.setMinutes(expires.getMinutes() + 5)
            user.VerificationToken = {
                token: verificationToken,
                expires: expires
            }
            await user.save()
            res.send("Please check your email for oyu new verification link.")

            const emailBody = `<p> Please click on the link to verify your account. <b>http://localhost:2000/user/verify/${verificationToken}</b></p>`;
            const subject = 'Reverification Email'
            await sendEmail(user.email, subject, emailBody).then(response => {
                console.log('Email sent successfully:', response);
            }).catch(error => {
                console.error('Error sending email:', error);
            });
        }
        res.send(token)
    } catch (err) {
        res.send("Something went wrong. Please try again later.")


    }
}

const updateUser = async (req, res) => {
    try {
        console.log(req.decodedData.id)
        res.json({ message: req.decodedData.id })
    } catch (err) {
        console.log(err);
        res.json({ message: "Something went wrong" })
    }
}

const forgotPassword = async (req, res) => {
    try {
        console.log(req.body)
        const isUserExisting = await UserModel.findOne({ email: req.body.email })
        if (!isUserExisting) {
            return res.status(400).json({ message: `User with the email ${req.body.email} is not available` });
        }
        const otp = otp_generator.generate(6, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: true })
        const expires = new Date
        expires.setMinutes(expires.getMinutes() + 5)
        isUserExisting.OTP_VerificationToken = {
            OTP: otp,
            expires: expires
        }
        await isUserExisting.save()
        res.status(200).json({ message: "OTP sent successfully" })
        const emailBody = `<p> Recently a password reset request has sent to our service.</p><p>Please enter the below OTP to reset password.</p><h1>${otp}</h1><p>OTP expires in 5 minutes.</p>`;
        const subject = 'Password reset request'
        await sendEmail(isUserExisting.email, subject, emailBody).then(response => {
            console.log('Email sent successfully:', response);
        }).catch(error => {
            console.error('Error sending email:', error);
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }
}

const verifyPasswordOTP = async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.isResendOTP) {
            const isUserExisting = await UserModel.findOne({ email: req.body.email })
            if (!isUserExisting) {
                return res.status(400).json({ message: `User with the email ${req.body.email} is not available` });
            }
            const otp = otp_generator.generate(6, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: true })
            const expires = new Date
            expires.setMinutes(expires.getMinutes() + 5)
            isUserExisting.OTP_VerificationToken = {
                OTP: otp,
                expires: expires
            }
            await isUserExisting.save()
            res.status(200).json({ message: "OTP sent successfully" })
            const emailBody = `<p> Recently a password reset OTP resend request has been sent.</p><p>Please enter the below OTP to reset password.</p><h1>${otp}</h1><p>OTP expires in 5 minutes.</p>`;
            const subject = 'Resend password reset OTP'
            await sendEmail(isUserExisting.email, subject, emailBody).then(response => {
                console.log('Email sent successfully:', response);
            }).catch(error => {
                console.error('Error sending email:', error);
            });
        }
        const isOTPValid = await UserModel.findOne(
            {
                "OTP_VerificationToken.OTP": req.body.otp,
                'OTP_VerificationToken.expires': { $gt: new Date() }
            });
        if (!isOTPValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        res.status(200).json({ message: "OTP Verified" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" })
    }
}

const updatePassword = async (req, res) => {
    try {
        console.log(req.body);
        const isUserExisting = await UserModel.findOne({ email: req.body.email });
        if (!isUserExisting) {
            return res.status(400).json({ message: `User with the email ${req.body.email} is not available` });
        }
        console.log(isUserExisting.OTP_VerificationToken.expires > Date.now())
        if (!isUserExisting.OTP_VerificationToken.expires > Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        isUserExisting.password = hashPassword
        await isUserExisting.save()
        const emailBody = `<p>Your password has been reset successfully</p>`;
        const subject = 'Password reset successful'
        await sendEmail(req.body.email, subject, emailBody).then(response => {
            console.log('Email sent successfully:', response);
        }).catch(error => {
            console.error('Error sending email:', error);
        });
        res.status(200).json({ message: "Password reset successful" })
    } catch (error) {
        console.log(error)
        res.status(error).json({ message: "Something gone wrong" })
    }
}

module.exports = { register, login, verifyUser, resendVerification, updateUser, forgotPassword, verifyPasswordOTP, updatePassword }