import express from "express";
import categoryContainer from "./category.container.js";
import vendorAuthenticate from "../../Middlewares/vendorAuthenticate.js";

const router = express.Router();

router.use(vendorAuthenticate);

router.get("/get-all", categoryContainer.categoryController.getAll);
router.get("/get/level/:level", categoryContainer.categoryController.getByLevel);
router.get("/get/:id", categoryContainer.categoryController.getById);

export default router;
