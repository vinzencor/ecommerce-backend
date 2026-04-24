import express from "express";
import adminAuditLogContainer from "./adminAuditLog.container.js";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";

const router = express.Router();
const { adminAuditLogController } = adminAuditLogContainer;

router.use(adminAuthenticate);

router.get("/", adminAuditLogController.getAll);
router.get("/:id", adminAuditLogController.getById);

export default router;
