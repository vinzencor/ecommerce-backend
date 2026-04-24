import express from "express";
import brandContainer from "./brand.container.js";
import vendorAuthenticate from "../../Middlewares/vendorAuthenticate.js";

const router = express.Router();

router.use(vendorAuthenticate);

router.get("/all", brandContainer.brandController.getAll);
router.get("/category/:categoryId", brandContainer.brandController.getByCategoryId);
router.get("/:id", brandContainer.brandController.getById);

export default router;
