import express from "express";
import wishlistController from "./wishlist.container.js";
import authenticate from "../../Middlewares/authenticate.js";
const router = express.Router();

router.use(authenticate);

router.post("/toggle", wishlistController.toggleWishlist);
router.delete("/:productId", wishlistController.removeItem);
router.get("/", wishlistController.getWishlist);

export default router;
