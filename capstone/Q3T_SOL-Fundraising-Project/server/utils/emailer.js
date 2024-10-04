const nodemailer = require('nodemailer');

// Create a transporter object with SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Or any other service like Yahoo, SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email address (from env variables for security)
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send an email
const sendEmail = async (to, subject, text, html = "") => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,  // Sender email address
      to: to,                            // Receiver's email address
      subject: subject,                  // Subject of the email
      text: text,                        // Plain text body
      html: html,                        // HTML body (optional)
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

module.exports = sendEmail;
