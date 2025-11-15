import multer from 'multer';

// Store files in memory buffer, not disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only images are allowed"), false);
  } else {
    cb(null, true);
  }
};

export default multer({ storage, fileFilter });
