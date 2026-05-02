import { Router } from "express";
import payoutController from "./payout.container.js";
import authenticateAdmin from "../../Middlewares/adminAuthenticate.js";
import authenticateVendor from "../../Middlewares/vendorAuthenticate.js";

const router = Router();

// Vendor routes
router.post("/request", authenticateVendor, payoutController.requestPayout.bind(payoutController));
router.get("/my-payouts", authenticateVendor, payoutController.getMyPayouts.bind(payoutController));

// Admin routes
router.get("/all", authenticateAdmin, payoutController.getAllPayouts.bind(payoutController));
router.patch("/:id/process", authenticateAdmin, payoutController.processPayout.bind(payoutController));

export default router;
