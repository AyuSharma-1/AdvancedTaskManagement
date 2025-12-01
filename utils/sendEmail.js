const nodemailer = require("nodemailer");

// transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayushkumarsharma102@gmail.com",   
    pass: "ngikbeeehfhtjjwv",  
  },
});

// send reset password link email
const sendPasswordResetEmail = async (to, token) => {
  try {
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Reset Your Password",
      html: `
        <div style="font-family:Arial,sans-serif;padding:16px">
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password. This link will expire in ${
            process.env.RESET_TOKEN_EXP_MIN || 15
          } minutes.</p>
          <a href="${resetLink}" 
             style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:4px">
            Reset Password
          </a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendPasswordResetEmail;