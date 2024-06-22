const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ksrinivassobhit03@gmail.com",
        pass: process.env.email_password
    }
})

const sendEmail = async (to, subject, body) => {
    let mailOptions = {
        to,
        from: "ksrinivassobhit03@gmail.com",
        subject,
        html: body
    }

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, res) => {
            if (error) {
                console.log(error);
                reject(error)
            }
            else {
                console.log(res);
                resolve(res)
            }
        })
    })
}

module.exports = sendEmail