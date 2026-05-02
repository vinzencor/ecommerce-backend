import express from "express";
import returnReasonContainer from "./returnReason.container.js";

const router = express.Router();

router.post("/", returnReasonContainer.create);
router.get("/", returnReasonContainer.findAll);
router.get("/:id", returnReasonContainer.findById);
router.patch("/:id", returnReasonContainer.update);
router.delete("/:id", returnReasonContainer.delete);

export default router;
