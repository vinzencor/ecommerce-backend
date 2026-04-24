import BannerRepository from "./banner.repository.js";
import BannerService from "./banner.service.js";
import BannerController from "./banner.controller.js";
import prisma from "../../Config/prismaClient.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const bannerRepository = new BannerRepository(prisma);
const bannerService = new BannerService(bannerRepository, adminAuditLogContainer.adminAuditLogService);
const bannerController = new BannerController(bannerService);

export default {
  bannerController,
  bannerService,
  bannerRepository,
};
