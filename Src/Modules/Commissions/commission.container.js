import prisma from "../../Config/prismaClient.js";
import CommissionRepository from "./commission.repository.js";
import CommissionService from "./commission.service.js";
import CommissionController from "./commission.controller.js";

const commissionRepository = new CommissionRepository(prisma);
const commissionService = new CommissionService(commissionRepository);
const commissionController = new CommissionController(commissionService);

export default commissionController;
export { commissionService };
