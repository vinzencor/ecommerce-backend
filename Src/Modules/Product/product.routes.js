import express from "express";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import validate from "../../Middlewares/validate.js";
import { createProductSchema, updateProductSchema } from "./productValidation.js";
import productContainer from "./product.container.js";
import upload from "../../Middlewares/upload.js";

const router = express.Router();


router.use(adminAuthenticate);

router.post("/create", upload.any(), validate(createProductSchema), productContainer.productController.create)
router.get("/get-all", productContainer.productController.findAll)
router.get("/get-stats", productContainer.productController.getStats)
router.get("/get-expiring-soon", productContainer.productController.getExpiringProducts)
router.get("/get/:id", productContainer.productController.findById)

router.patch("/update/:id", upload.any(), validate(updateProductSchema), productContainer.productController.update)
router.patch("/toggle-status/:id",productContainer.productController.toggleStatus)


export default router;
