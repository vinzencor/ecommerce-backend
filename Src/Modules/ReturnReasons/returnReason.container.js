import prisma from "../../Config/prismaClient.js";
import ReturnReasonRepository from "./returnReason.repository.js";
import ReturnReasonService from "./returnReason.service.js";
import ReturnReasonController from "./returnReason.controller.js";

const returnReasonRepository = new ReturnReasonRepository(prisma);
const returnReasonService = new ReturnReasonService(returnReasonRepository);
const returnReasonController = new ReturnReasonController(returnReasonService);

export default returnReasonController;
