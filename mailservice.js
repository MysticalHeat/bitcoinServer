const nodemailer = require('nodemailer');

function sendMail(usd, emails) {
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let message = {
        from: process.env.MAIL_USER,
        to: emails.join(" ,"),
        subject: 'Биткоин сейчас',
        text: 'Биткоин',
        html: `<p>Цена биткоина сейчас: <b>${usd}$</b></p>`
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }
    });
}

module.exports = { sendMail }