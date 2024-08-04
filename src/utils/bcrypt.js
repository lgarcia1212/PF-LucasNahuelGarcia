import bcrypt from "bcrypt";

const saltRounds = 10;

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));

export const validatePassword = (passwordSend, passwordBdd) =>
  bcrypt.compareSync(passwordSend, passwordBdd);
