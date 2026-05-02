import { Router } from "express";
import reviewController from "./review.container.js";
import authenticateUser from "../../Middlewares/authenticate.js";

const router = Router();

// Public routes
router.get("/product/:productId", reviewController.getProductReviews.bind(reviewController));

// Protected routes
router.use(authenticateUser);
router.get("/check-purchase/:productId", reviewController.checkPurchaseEligibility.bind(reviewController));
router.post("/:productId", reviewController.createReview.bind(reviewController));

export default router;
