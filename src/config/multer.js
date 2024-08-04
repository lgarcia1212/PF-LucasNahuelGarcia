import multer from "multer";
import { __dirname } from "../path.js";


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const storageProducts = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + `/public/img/products`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const storageDocs = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + `/public/img/docs`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const storageProfiles = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + `/public/img/profiles`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

export const uploadProd = multer({ 
  storage: storageProducts,
  fileFilter: fileFilter
});
export const uploadDocs = multer({ 
  storage: storageDocs,
  fileFilter: fileFilter
});
export const uploadPerfs = multer({ 
  storage: storageProfiles,
  fileFilter: fileFilter
});
