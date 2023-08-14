import nodemailer from "nodemailer";
import { verifyEmailHtml } from "../../view/verifyEmail.js";

export const verifyEmail = async (option) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Trello App 📝" <${process.env.EMAIL_ADDRESS}>`,
      to: option?.email,
      subject: "Trello App Email Verification",
      html: verifyEmailHtml(
        `${option?.protocol}://${option?.host}/api/v1/user/verify/${option?.token}`
      ),
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error(error);
  }
};

// verifyEmail().catch(console.error);
