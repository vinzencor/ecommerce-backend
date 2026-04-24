import prisma from "../../Config/prismaClient.js";
import CategoryRepository from "./category.repository.js";
import CategoryService from "./category.service.js";
import CategoryController from "./category.controller.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const categoryRepository = new CategoryRepository(prisma);
const categoryService    = new CategoryService(categoryRepository, adminAuditLogContainer.adminAuditLogService);
const categoryController = new CategoryController(categoryService);

export default {
    categoryRepository,
    categoryService,
    categoryController,
};