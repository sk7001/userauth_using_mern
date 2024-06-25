const UserModel = require("../Models/UserModel")
const otp_generator = require("otp-generator")
const bcrypt = require("bcrypt")
const sendEmail = require("../Emailservice/Email")

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
        res.json("login working succssfully");
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
            isTokenValid.isVerified=true
            res.send(`Your email has been verified. Please login to continue.<a href="http://localhost:3000/signup">Login</a>`);
        }
        else{
            res.send('Link has been expired. Please signup again to continue.<a href="http://localhost:3000/register">Signup</a>')
            return res.status(400).json({message:"Token ivalid or expired"})
        }
        await isTokenValid.save()
    } catch (error) {
        console.log(error)
    }
}


module.exports = { register, login, verifyUser }
