import express from "express";
import cartController from "./cart.container.js";
import authenticate from "../../Middlewares/authenticate.js";

const router = express.Router();

// Public Routes
router.get("/shared/:shareId", cartController.getSharedCart);

// Authenticated Routes
router.use(authenticate);

router.post("/", cartController.addToCart);
router.post("/share", cartController.shareCart);
router.get("/", cartController.getCart);
router.delete("/:variantId", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

export default router;
