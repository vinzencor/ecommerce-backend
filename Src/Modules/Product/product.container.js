import prisma from "../../Config/prismaClient.js";
import ProductRepository from "./product.repository.js";
import ProductService from "./product.service.js";
import ProductController from "./product.controller.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const productRepository = new ProductRepository(prisma);
const productService    = new ProductService(productRepository, adminAuditLogContainer.adminAuditLogService);
const productController = new ProductController(productService);

export default {
    productRepository,
    productService,
    productController,
};
