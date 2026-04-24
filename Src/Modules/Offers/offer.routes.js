import express from "express";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import validate from "../../Middlewares/validate.js";
import { createOfferSchema, updateOfferSchema } from "./offer.validation.js";
import offerContainer from "./offer.container.js";
import upload from "../../Middlewares/upload.js";

const router = express.Router();

router.use(adminAuthenticate);

router.post("/create", upload.single("image"), validate(createOfferSchema), offerContainer.offerController.createOffer);
router.get("/all", offerContainer.offerController.getAllOffers);
router.get("/:id", offerContainer.offerController.getOfferById);

router.put("/:id", upload.single("image"), validate(updateOfferSchema), offerContainer.offerController.updateOffer);
router.patch("/toggle-status/:id", offerContainer.offerController.toggleOfferStatus);
router.delete("/:id", offerContainer.offerController.deleteOffer);

export default router;
