import express from "express";
import categoryContainer from "./category.container.js";

const router = express.Router();


// Fetch all main categories for mob
router.get("/main", categoryContainer.categoryController.getMainCategories);

// Fetch Category details for mob
router.get("/details/:id", categoryContainer.categoryController.getCategoryDetails);

export default router;
