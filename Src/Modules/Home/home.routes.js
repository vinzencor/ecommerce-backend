import express from "express";
import homeController from "./home.container.js";

const router = express.Router();

router.get("/h", homeController.getHomeData);
router.get("/h/product/:id", homeController.getProductById);
router.get("/category/products/:id", homeController.getCategoryProducts);
router.get("/offer/products/:id", homeController.getOfferProducts);
router.get("/search", homeController.search);
router.get("/filteroptions/:categoryId", homeController.getFilterOptions);
router.get("/filter", homeController.filter);

export default router;
