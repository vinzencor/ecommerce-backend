import express from "express";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import coinRewardContainer from "./coinReward.container.js";

const router = express.Router();

router.use(adminAuthenticate);

router.get("/settings", coinRewardContainer.coinRewardController.getSettings);
router.post("/settings", coinRewardContainer.coinRewardController.createSettings);
router.patch("/settings", coinRewardContainer.coinRewardController.updateSettings);

export default router;
