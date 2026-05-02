import { Router } from "express";
import commissionController from "./commission.container.js";
import authenticateAdmin from "../../Middlewares/adminAuthenticate.js";
import authenticateVendor from "../../Middlewares/vendorAuthenticate.js";

const router = Router();

// Vendor routes
router.get("/my-commissions", authenticateVendor, commissionController.getMyCommissions.bind(commissionController));

// Admin routes
router.use(authenticateAdmin);
router.get("/all", commissionController.getAllCommissions.bind(commissionController));


router.get("/stats", commissionController.getCommissionStats.bind(commissionController));
router.get("/vendors", commissionController.getVendorsWithCommission.bind(commissionController));
router.post("/vendors", commissionController.setVendorCommission.bind(commissionController));
router.patch("/vendors/:vendorId", commissionController.updateVendorCommission.bind(commissionController));
router.get("/available-vendors", commissionController.getAvailableVendors.bind(commissionController));

export default router;
