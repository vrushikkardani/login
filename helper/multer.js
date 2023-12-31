const multer = require("multer");
const path = require("path");
const fs = require("fs");

/** code to configure user upload profile image starts */
const userUploadDirPath = path.join(
  __dirname,
  "..",
  "/public/user-profile"
);

let userImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userUploadDirPath);
  },
  filename: function (req, file, cb) {
    let exploded_name = file.originalname.split(".");
    let ext = exploded_name[exploded_name.length - 1];
    cb(null, Date.now() + "." + ext);
  },
});

let userImageUpload = multer({
  storage: userImageStorage,
  limits: {
    fileSize: 15000000,// 5MB
    // resize:150*150 //150*150
  },
  fileFilter: function (req, file, cb) {
    return cb(null, true);
  },
}).fields([{ name: "image"}]);
 
/** END */

module.exports = {
  userImageUpload
};
