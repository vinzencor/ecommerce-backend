import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../Config/cloudinary.js";

// Cloudinary storage — uploads directly to Cloudinary, no local disk needed
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "ecommerce/products",   
        resource_type: "auto",          
    },
});

// Allow image and video files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed."), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max for videos
});

export default upload;
