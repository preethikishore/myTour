/*eslint-env node*/
const nodemailer = require('nodemailer');

const sentEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth : {
           user: process.env.EMAIL_USERNAME ,
           pass :process.env.EMAIL_PASSWORD
        }

    })

    const mailOptions = {
        from: 'preethikishore <preethikishre@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message

    }
   await transporter.sendMail(mailOptions)
}
module.exports = sentEmail