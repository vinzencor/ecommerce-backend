import prisma from "../../Config/prismaClient.js";

import OfferRepository from "./offer.repository.js";
import OfferService from "./offer.service.js";
import OfferController from "./offer.controller.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const offerRepository = new OfferRepository(prisma);
const offerService    = new OfferService(offerRepository, adminAuditLogContainer.adminAuditLogService);
const offerController = new OfferController(offerService);

export default {
    offerRepository,
    offerService,
    offerController,
};
