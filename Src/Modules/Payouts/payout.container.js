import prisma from "../../Config/prismaClient.js";
import PayoutRepository from "./payout.repository.js";
import PayoutService from "./payout.service.js";
import PayoutController from "./payout.controller.js";

const payoutRepository = new PayoutRepository(prisma);
const payoutService = new PayoutService(payoutRepository);
const payoutController = new PayoutController(payoutService);

export default payoutController;
