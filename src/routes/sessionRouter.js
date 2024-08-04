import { Router } from "express";
import passport from "passport";
import { login, register, sessionGithub, logout, testJWT, sendEmailPassword, changePassword } from "../controllers/sessionController.js";

const sessionRouter = Router();

sessionRouter.post("/login", passport.authenticate("login", { failureMessage: true }), login);
sessionRouter.post("/register", passport.authenticate("register"), register);
sessionRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
sessionRouter.get("/githubSession", passport.authenticate("github"), sessionGithub);
sessionRouter.get("/current", passport.authenticate("jwt"), (req, res) => res.status(200).send("Usuario logueado"));
sessionRouter.get("/logout", logout);
sessionRouter.get("/testJWT", passport.authenticate("jwt", { session: false }), testJWT);
sessionRouter.post("/reset-password/:token", changePassword);

export default sessionRouter;
