import prisma from "../../../Config/prismaClient.js";
import AdminAuthRepository from "./adminAuthrepository.js";
import AdminAuthService from "./adminAuthservice.js"
import AdminAuthController from "./adminAuthcontoller.js";

const adminAuthRepository = new AdminAuthRepository(prisma);
const adminAuthService    = new AdminAuthService(adminAuthRepository);
const adminAuthController = new AdminAuthController(adminAuthService);

export default {
    adminAuthRepository,
    adminAuthService,
    adminAuthController,
};