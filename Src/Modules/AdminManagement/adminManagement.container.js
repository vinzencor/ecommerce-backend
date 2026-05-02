import prisma from "../../Config/prismaClient.js";
import AdminManagementRepository from "./adminManagement.repository.js";
import AdminManagementService from "./adminManagement.service.js";
import AdminManagementController from "./adminManagement.controller.js";

const adminManagementRepository = new AdminManagementRepository(prisma);
const adminManagementService = new AdminManagementService(adminManagementRepository);
const adminManagementController = new AdminManagementController(adminManagementService);

export default adminManagementController;
