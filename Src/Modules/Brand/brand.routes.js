import express from "express";
import brandContainer from "./brand.container.js";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import upload from "../../Middlewares/upload.js";
import validate from "../../Middlewares/validate.js";
import { createBrandSchema, updateBrandSchema } from "./brand.validation.js";

const router = express.Router();

// Public
router.get("/all", brandContainer.brandController.getAll);
router.get("/category/:categoryId", brandContainer.brandController.getByCategoryId);
router.get("/:id", brandContainer.brandController.getById);

// Admin only
router.use(adminAuthenticate);

router.post(
  "/create",
  upload.single("image"),
  validate(createBrandSchema),
  brandContainer.brandController.create
);

router.patch(
  "/update/:id",
  upload.single("image"),
  validate(updateBrandSchema),
  brandContainer.brandController.update
);

router.patch("/toggle-status/:id", brandContainer.brandController.toggleStatus);
router.delete("/:id", brandContainer.brandController.delete);

export default router;
