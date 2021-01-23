
const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    //folder: 'fbpost',
    //format: async (req, file) => 'png', // supports promises as well
    //public_id: (req, file) =>uuidv4()+"-"+file.originalname,
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage:storage
});

module.exports = upload;
