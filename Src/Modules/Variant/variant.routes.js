import express from "express";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import validate from "../../Middlewares/validate.js";
import { createVariantNameSchema, updateVariantNameSchema, createVariantValueSchema, updateVariantValueSchema } from "./variantValidation.js";
import variantContainer from "./variant.container.js";

const router = express.Router();

router.use(adminAuthenticate);

// Variant Names
router.post("/", validate(createVariantNameSchema), variantContainer.variantController.createName);
router.get("/", variantContainer.variantController.findAllNames);
router.get("/:id", variantContainer.variantController.findNameById);
router.patch("/:id", validate(updateVariantNameSchema), variantContainer.variantController.updateName);
router.patch("/toggle-status/:id", variantContainer.variantController.toggleNameStatus);
router.get("/category/:categoryId", variantContainer.variantController.getByCategory);


export default router;
