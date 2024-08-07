import nodemailer from "nodemailer"
import User from "@/models/User"
import bcryptjs from "bcryptjs"

export const sendEmail = async({email, emailType, userId}:any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)

    if(emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId,
        {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000
        },
      )
    } else if(emailType === "RESET") {
      await User.findByIdAndUpdate(userId,
        {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000
        },
      )
    }

    var transport = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "api",
        pass: "03215ebc81b1c94c07faa9a5bc383ba7"
      }
    });

    const mailOptions = {
      from: 'mailtrap@prosperadefi.com',
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
    }

    const mailresponse = await transport.sendMail(mailOptions);
    console.log("Email sent successfully:", mailresponse.messageId);
    return mailresponse;

  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(error.message);
  }
}