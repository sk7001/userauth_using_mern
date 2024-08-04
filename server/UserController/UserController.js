const UserModel = require("../Models/UserModel")
const otp_generator = require("otp-generator")
const bcrypt = require("bcrypt")
const sendEmail = require("../Emailservice/Email")
const jwt = require("jsonwebtoken")

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
        const isUserExisting = await UserModel.findOne({ email: req.body.email })
        console.log(isUserExisting)
        if (!isUserExisting) {
            return res.status(400).json({ message: `User with the email ${req.body.email} doesn't exist.` });
        }
        if (!isUserExisting.isVerified) {
            return res.status(400).json({ message: `User with the email ${req.body.email}is not verified. Please click the link in the email sent to you to verify.` })
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, isUserExisting.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: `Invalid Password` });
        }
        //generate JWT token

        const jwtPayload = {
            id: isUserExisting._id,
        }
        const token = jwt.sign(jwtPayload, process.env.SECRET, { expiresIn: '24h' })
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

module.exports = { register, login, verifyUser, resendVerification, updateUser }
