import nodemailer from "nodemailer";
import varenv from "../dotenv.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: varenv.email_user,
    pass: varenv.email_pass,
  },
});

export const sendEmailChangePassword = async (email, linkChangePassword) => {
  const mailOptions = {
    from: varenv.email_user,
    to: email,
    subject: "Recuperación de contraseña",
    text: `Haz clic aquí para cambiar tu contraseña: ${linkChangePassword}`,
    html: `<p>Haz click aquí para cambiar tu contraseña:</p><a href="${linkChangePassword}">Cambiar contraseña</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado con éxito.");
  } catch (error) {
    console.log("Error al intentar enviar correo de recuperación de contraseña: " + error.message);
  }
};
