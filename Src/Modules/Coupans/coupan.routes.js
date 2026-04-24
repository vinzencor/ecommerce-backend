import express from "express";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import validate from "../../Middlewares/validate.js";
import { createCoupanSchema, updateCoupanSchema } from "./coupan.validation.js";
import coupanContainer from "./coupan.container.js";

const router = express.Router();

router.use(adminAuthenticate);

router.post("/", validate(createCoupanSchema), coupanContainer.coupanController.createCoupan);
router.get("/", coupanContainer.coupanController.getAllCoupons);
router.get("/:id", coupanContainer.coupanController.getCoupanById);
router.patch("/:id", validate(updateCoupanSchema), coupanContainer.coupanController.updateCoupan);
router.patch("/toggle-status/:id", coupanContainer.coupanController.toggleCoupanStatus);
router.delete("/:id", coupanContainer.coupanController.deleteCoupan);



export default router;
