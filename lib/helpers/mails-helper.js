const nodemailer = require('nodemailer');
exports.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "copudding4@gmail.com", // generated ethereal user
            pass: "aliceDoll8756_<3" // generated ethereal password
        }
    });