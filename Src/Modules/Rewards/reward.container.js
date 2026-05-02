import prisma from "../../Config/prismaClient.js";
import RewardRepository from "./reward.repository.js";
import RewardService from "./reward.service.js";
import RewardController from "./reward.controller.js";

const rewardRepository = new RewardRepository(prisma);
const rewardService = new RewardService(rewardRepository);
const rewardController = new RewardController(rewardService);

export default rewardController;
