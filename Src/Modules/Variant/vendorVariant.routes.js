import express from "express";
import variantContainer from "./variant.container.js";
import vendorAuthenticate from "../../Middlewares/vendorAuthenticate.js";

const router = express.Router();

router.use(vendorAuthenticate);

router.get("/", variantContainer.variantController.findAllNames);
router.get("/category/:categoryId", variantContainer.variantController.getByCategory);
router.get("/:id", variantContainer.variantController.findNameById);

export default router;
