import { sendEmailChangePassword } from "../utils/nodemailer.js";
import { userModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import { validatePassword, createHash } from "../utils/bcrypt.js";
import varenv from "../dotenv.js";


export const login = (req, res) => {
  try {
    const user = req.user;
    req.session.user = {
      _id: user._id,
      email: user.email,
      rol: user.rol,
      cart_id: user.cart_id,
    };
    console.log("Datos sesión:", req.session.user);
    res.status(200).json({ rol: req.session.user.rol });
  } catch (error) {
    res.status(500).json({ message: `Ocurrió un error en el servidor: ${error.message}` });
  }
};

export const register = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send("El usuario ya existe en la aplicación.");
    }
    res.redirect("/");
  } catch (e) {
    res.status(500).send(`Error al intentar registrar el usuario: ${e.message}`);
  }
};

export const logout = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.session.user.email });
    if (user) {
      user.last_connection = new Date();
      await user.save();
    }
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al cerrar sesión.");
      } else {
        res.status(200).redirect("/");
      }
    });
  } catch (error) {
    res.status(500).send(`Error al intentar cerrar sesión: ${error.message}`);
  }
};

export const sessionGithub = (req, res) => {
  req.session.user = {
    email: req.user.email,
    first_name: req.user.name,
  };
  res.redirect("/");
};

export const testJWT = (req, res) => {
  if (req.user.rol === "User") {
    res.status(403).send("El usuario no está autorizado.");
  } else {
    res.status(200).json(req.user);
  }
};

export const changePassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const { userEmail } = jwt.verify(token.substr(6), varenv.JWT_SECRET);
    const user = await userModel.findOne({ email: userEmail });
    if (user) {
      if (validatePassword(newPassword, user.password)) {
        return res.status(400).send("La contraseña debe ser diferente a la anterior.");
      }
      user.password = createHash(newPassword);
      await user.save();
      res.status(200).send("Contraseña modificada exitosamente.");
    } else {
      res.status(400).send("Error al intentar encontrar el usuario.");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(`Error al intentar cambiar la contraseña: ${e.message}`);
  }
};

export const sendEmailPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const token = jwt.sign({ userEmail: email }, varenv.JWT_SECRET, { expiresIn: "1h" });
      const resetLink = `http://localhost:8080/api/session/reset-password/${token}`;
      await sendEmailChangePassword(email, resetLink);
      res.status(200).send("Email enviado exitosamente.");
    } else {
      res.status(404).send("Usuario no encontrado.");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(`Error al enviar el email: ${e.message}`);
  }
};
