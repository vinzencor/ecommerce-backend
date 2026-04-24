import express from "express";
import adminAuthcontainer from "./adminAuthcontainer.js";
import validate from "../../../Middlewares/validate.js";
import { adminLoginSchema } from "../../../Utils/authValidation.js";

const router = express.Router();
// admin
router.post("/login", validate(adminLoginSchema), adminAuthcontainer.adminAuthController.login);
router.post("/refresh-token", adminAuthcontainer.adminAuthController.refreshToken);
router.post("/logout",adminAuthcontainer.adminAuthController.logout);

export default router;