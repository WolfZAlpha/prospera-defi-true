import nodemailer from "nodemailer"
import User from "@/models/User"
import bcryptjs from "bcryptjs"

interface EmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async({ email, emailType, userId }: EmailParams) => {
  try {
    // Generate hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Update user with token
    const updateData = emailType === "VERIFY" 
      ? { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
      : { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 };
    
    await User.findByIdAndUpdate(userId, updateData);

    // Create transport
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT || '587'),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    // Verify transport connection
    await transport.verify();

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      text: `Click the link to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}: ${process.env.NEXT_PUBLIC_APP_URL}/verifyemail?token=${hashedToken}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">
            ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"}
          </h1>
          <p>Click the link below to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/verifyemail?token=${hashedToken}">
            ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
          </a>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    // Send email
    const mailresponse = await transport.sendMail(mailOptions);
    console.log("Email sent successfully:", mailresponse.messageId);
    return mailresponse;

  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}