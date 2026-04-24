import express from "express";
import vendorContainer from "./vendor.container.js";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import upload from "../../Middlewares/upload.js";

const { vendorController } = vendorContainer;
const router = express.Router();

router.post("/setup-password", vendorController.setupPassword);

router.use(adminAuthenticate);

router.get("/", vendorController.getVendors);
router.get("/stats", vendorController.getVendorStats);
router.get("/:id", vendorController.getVendorById);
router.post("/create",upload.any(),vendorController.createVendor);
router.patch('/update/:id',upload.any(),vendorController.updateVendor)
router.patch("/:id", vendorController.updateVendorStatus);
router.patch("/:id/favourite", vendorController.toggleFavourite);

export default router;
