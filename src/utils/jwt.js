import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../dotenv.js";

export const generateToken = (user) => {
  return jwt.sign({ user }, JWT_SECRET, {
    expiresIn: "12h",
  });
};
