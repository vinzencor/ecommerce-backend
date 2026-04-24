import BrandRepository from "./brand.repository.js";
import BrandService from "./brand.service.js";
import BrandController from "./brand.controller.js";
import prisma from "../../Config/prismaClient.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const brandRepository = new BrandRepository(prisma);
const brandService = new BrandService(brandRepository, adminAuditLogContainer.adminAuditLogService);
const brandController = new BrandController(brandService);

export default {
  brandController,
  brandService,
  brandRepository,
};
