import prisma from "../../Config/prismaClient.js";
import RefundRepository from "./refund.repository.js";
import RefundService from "./refund.service.js";
import RefundController from "./refund.controller.js";

const refundRepository = new RefundRepository(prisma);
const refundService = new RefundService(refundRepository);
const refundController = new RefundController(refundService);

export default refundController;
