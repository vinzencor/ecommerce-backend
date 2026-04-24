import express from "express";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import validate from "../../Middlewares/validate.js";
import { createDealSchema, updateDealSchema } from "./deal.validation.js";
import dealContainer from "./deal.container.js";

const router = express.Router();
const { dealController } = dealContainer;

// Public route
router.get("/today", dealController.getTodayDeals);

// Admin routes
router.use(adminAuthenticate);

router.post("/", validate(createDealSchema), dealController.create);
router.get("/", dealController.findAll);
router.get("/:id", dealController.findById);
router.patch("/:id", validate(updateDealSchema), dealController.update);
router.patch("/toggle-status/:id", dealController.toggleStatus);
router.delete("/:id", dealController.delete);

export default router;

