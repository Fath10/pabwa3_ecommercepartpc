import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/products");
  },

  filename(req, file, cb) {
    const uniqueName =
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Hanya JPG, PNG dan WEBP yang diperbolehkan"
      ),
      false
    );
  }

};



export const upload = multer({
  storage,
  fileFilter,
  // limits: {
  //   fileSize: 5 * 1024 * 1024
  // }
});