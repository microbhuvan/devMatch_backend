const multer = require("multer");
const { cloudinary } = require("./cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary"); //saves files directly to cloudinary instead of loacal storage

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_photos",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 300, height: 300, crop: "limit" }],
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
