import fs from "node:fs";
import multer, { diskStorage, MulterError } from "multer";

const DIR = "./public/images";

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const extArray = file.mimetype.split("/");
    const extension = extArray[1];
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png"
      || file.mimetype === "image/jpg"
      || file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    }
    else {
      cb(new MulterError("not a picture"));
    }
  },
});

export default upload;
