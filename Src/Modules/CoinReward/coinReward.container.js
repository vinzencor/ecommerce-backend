import CoinRewardController from "./coinReward.controller.js";
import CoinRewardRepository from "./coinReward.repository.js";
import CoinRewardService from "./coinReward.service.js";
import prisma from "../../Config/prismaClient.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const coinRewardRepository = new CoinRewardRepository(prisma);
const coinRewardService = new CoinRewardService(coinRewardRepository, adminAuditLogContainer.adminAuditLogService);
const coinRewardController = new CoinRewardController(coinRewardService);

export default {
    coinRewardController,
    coinRewardService,
    coinRewardRepository
};
