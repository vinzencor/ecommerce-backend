import { Router } from "express";
import reviewController from "./review.container.js";
import authenticateAdmin from "../../Middlewares/adminAuthenticate.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", reviewController.getAllReviews.bind(reviewController));
router.get("/all", reviewController.getAllReviews.bind(reviewController));
router.get("/stats", reviewController.getStats.bind(reviewController));
router.patch("/:id/status", reviewController.toggleStatus.bind(reviewController));
router.delete("/:id", reviewController.deleteReview.bind(reviewController));

export default router;
