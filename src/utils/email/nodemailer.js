import { createTransport } from "nodemailer";
import { verifyEmailHtml } from "../../view/verifyEmail.js";

export const verifyEmail = async (option) => {
  const transporter = createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Sara7a App 🌹" <${process.env.EMAIL_ADDRESS}>`,
    to: option?.email,
    subject: "Sara7a App Email Verification",
    html: verifyEmailHtml(
      `http://localhost:3000/api/v1/user/verify/${option?.token}`
    ),
  });

  console.log("Message sent: %s", info.messageId);
};

verifyEmail().catch(console.error);
