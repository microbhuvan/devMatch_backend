const multer = require("multer");
const { cloudinary } = require("./cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_photos",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 100, height: 100, crop: "limit" }],
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
