import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/s3.js";

export const upload = multer({
    storage: multerS3({
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        key: function (req, file, cb) {
            cb(null, `uploads/${Date.now()}-${file.originalname}`);
        },
    }),
});