import express from 'express';
import session from 'express-session';
import cors from 'cors';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import messageModel from './models/messages.js';
import indexRouter from './routes/indexRouter.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport/passport.js';
import varenv from './dotenv.js';
import { __dirname } from './path.js';
import { Server } from 'socket.io';
import path from 'path';

// Configuración del servidor
const app = express();
const PORT = 8000;

// Servidor
const SERVER = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

// Configuración de Socket.IO
const io = new Server(SERVER);

// Configuración de CORS
const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, './public')));

// Conexión a la base de datos
mongoose.connect(varenv.mongo_url)
  .then(() => console.log("DB is connected"))
  .catch(error => console.error('Error al conectar a MongoDB:', error));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(varenv.cookies_secret));

// Configuración de sesión
app.use(session({
  secret: varenv.session_secret,
  resave: true,
  store: MongoStore.create({
    mongoUrl: varenv.mongo_url,
    ttl: 60 * 60, // 1 hora
  }),
  saveUninitialized: true,
}));

// Inicializar Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/', indexRouter);

// Rutas de Cookies
app.get('/setCookie', (req, res) => {
  res.cookie('CookieCookie', 'Esto es una cookie :)', { maxAge: 3000000, signed: true }).send("Cookie creada");
});

app.get('/getCookie', (req, res) => {
  res.send(req.signedCookies);
});

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('CookieCookie').send("Cookie eliminada");
});

// Rutas de sesión
app.get('/session', (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Visitaste el sitio ${req.session.counter} veces.`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido ¡sos el primer usuario que ingresa!");
  }
});

// Configuración de Socket.IO
io.on('connection', (socket) => {
  socket.on('mensaje', async (mensaje) => {
    try {
      await messageModel.create(mensaje);
      const mensajes = await messageModel.find();
      io.emit('mensajeLogs', mensajes);
    } catch (e) {
      io.emit('mensajeLogs', e);
    }
  });
});
