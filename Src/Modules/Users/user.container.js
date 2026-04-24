import UserRepository from "./user.repository.js";
import UserService from "./user.service.js";
import UserController from "./user.controller.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository, adminAuditLogContainer.adminAuditLogService);
const userController = new UserController(userService);

export default {
    userRepository,
    userService,
    userController
};
