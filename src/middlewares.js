import jwt from "jsonwebtoken";
import multer, { diskStorage, MulterError } from "multer";
import { env } from "./env.js";

export function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(err, req, res, _next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
const { verify } = jwt;

// eslint-disable-next-line node/no-process-env
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function isLoggedIn(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "لم يتم توفير رمز الدخول" });
    }

    const deCoded = verify(token, JWT_SECRET);
    req.currentUser = deCoded;// create a currentUser object in the request
    next();
  }
  catch (e) {
    res.status(500).json(e);
  }
}

const DIR = "./public/images";

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[1];
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
    }
    else {
      cb(new MulterError("not a picture"));
    }
  },
});
