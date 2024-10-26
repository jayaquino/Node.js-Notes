const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  console.log('creating transporter');
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  console.log('email options');
  // 2) Define the email options
  const mailOptions = {
    from: 'Nelson Aquino <justjaystuff@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  console.log('sending');
  // 3) Send the email
  await transporter.sendMail(mailOptions);
  console.log('sent');
};

module.exports = sendEmail;
