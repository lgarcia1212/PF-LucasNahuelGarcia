import local from "passport-local";
import passport from "passport";
import GithubStrategy from "passport-github2";
import { userModel } from "../../models/user.js";
import { createHash, validatePassword } from "../../utils/bcrypt.js";
import { strategyJWT } from "./jwtStrategy.js";


const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;
          if (!first_name || !last_name || !email || !password || !age) {
            return done(null, false, { message: "Todos los campos son obligatorios" });
          }
          const findUser = await userModel.findOne({ email: email });
          if (findUser) {
            return done(null, false, { message: "El usuario ya existe" });
          } else {
            const user = await userModel.create({
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
            });
            return done(null, user);
          }
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (user && validatePassword(password, user.password)) {
          user.last_connection = new Date();
          await user.save();
          return done(null, user);
        } else {
          return done(null, false, { message: "Usuario o contraseña inválidos" });
        }
      } catch (e) {
        return done(e);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (e) {
      done(e, null);
    }
  });

  passport.use("jwt", strategyJWT);
};

export default initializePassport;
