import CoupanController from "./coupan.controller.js";
import CoupanRepository from "./coupan.repository.js";
import CoupanService from "./coupan.service.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const coupanRepository = new CoupanRepository();
const coupanService = new CoupanService(coupanRepository, adminAuditLogContainer.adminAuditLogService);
const coupanController = new CoupanController(coupanService);

export default {
    coupanController,
    coupanService,
    coupanRepository
};