import express from "express";
import categoryContainer from "./category.container.js";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import upload from "../../Middlewares/upload.js";

const router = express.Router();

// All category routes require a valid admin access token
router.use(adminAuthenticate);

router.post("/create", upload.single("image"), categoryContainer.categoryController.create);
router.get("/get-all", categoryContainer.categoryController.getAll);
router.get("/get/level/:level", categoryContainer.categoryController.getByLevel);
router.get("/get/:id", categoryContainer.categoryController.getById);
router.put("/update/:id", upload.single("image"), categoryContainer.categoryController.update);
router.patch("/toggle-status/:id", categoryContainer.categoryController.toggleStatus);

export default router;
