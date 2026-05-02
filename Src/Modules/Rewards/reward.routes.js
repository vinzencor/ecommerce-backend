import { Router } from "express";
import rewardController from "./reward.container.js";
import authenticateAdmin from "../../Middlewares/adminAuthenticate.js";
import authenticateUser from "../../Middlewares/authenticate.js";

const router = Router();

// User routes
router.get("/my-rewards", authenticateUser, rewardController.getMyRewards.bind(rewardController));

// Admin routes
router.get("/all", authenticateAdmin, rewardController.getAllRewards.bind(rewardController));
router.post("/give", authenticateAdmin, rewardController.giveReward.bind(rewardController));

export default router;
