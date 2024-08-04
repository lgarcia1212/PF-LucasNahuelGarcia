import express from "express";
import path from "path";
import { __dirname } from "../path.js";
import cartRouter from "./cartRouter.js";
import productsRouter from "./productsRouter.js";
import userRouter from "./userRouter.js";
import chatRouter from "./chatRouter.js";
import sessionRouter from "./sessionRouter.js";
import multerRouter from "./multerRouter.js";

const indexRouter = express.Router();

// Servir archivos estáticos desde 'public'
indexRouter.use(express.static(path.join(__dirname, "../public")));

// Rutas API
indexRouter.use("/api/products", productsRouter);
indexRouter.use("/api/cart", cartRouter);
indexRouter.use("/api/users", userRouter);
indexRouter.use("/api/session", sessionRouter);
indexRouter.post("/upload", multerRouter);

// Rutas para servir los archivos HTML desde 'public/pages'
indexRouter.get("/home", (req, res) => res.sendFile(path.join(__dirname, "../public/pages/products.html")));
indexRouter.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "../public/pages/admin.html")));
indexRouter.get("/admin/products", (req, res) => res.sendFile(path.join(__dirname, "../public/pages/productsAdmin.html")));
indexRouter.get("/cart", (req, res) => res.sendFile(path.join(__dirname, "../public/pages/cart.html")));
indexRouter.get("/", (req, res) => res.sendFile(path.join(__dirname, "../public/pages/login.html")));
indexRouter.get("/register", (req, res) => res.sendFile(path.join(__dirname, "../public/pages/register.html")));
indexRouter.get("/ticket", (req, res) => res.sendFile(path.join(__dirname, "../public/pages/ticket.html")));

export default indexRouter;
