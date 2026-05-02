import { Router } from "express";
import refundController from "./refund.container.js";
import authenticateAdmin from "../../Middlewares/adminAuthenticate.js";
import authenticateUser from "../../Middlewares/authenticate.js";

const router = Router();

// User routes
router.post("/request", authenticateUser, refundController.requestRefund.bind(refundController));

// Admin routes
router.get("/all", authenticateAdmin, refundController.getAllRefunds.bind(refundController));
router.get("/:id", authenticateAdmin, refundController.getRefundById.bind(refundController));
router.patch("/:id/process", authenticateAdmin, refundController.processRefund.bind(refundController));

export default router;
