import { Router } from "express";
import adminManagementController from "./adminManagement.container.js";
import authenticateAdmin from "../../Middlewares/adminAuthenticate.js";

const router = Router();

router.use(authenticateAdmin);

router.post("/", adminManagementController.createSubadmin.bind(adminManagementController));
router.get("/", adminManagementController.getAllAdmins.bind(adminManagementController));
router.put("/:id", adminManagementController.updateAdmin.bind(adminManagementController));
router.delete("/:id", adminManagementController.deleteAdmin.bind(adminManagementController));

export default router;
