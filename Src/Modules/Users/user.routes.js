import express from "express";
import userContainer from "./user.container.js";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import validate from "../../Middlewares/validate.js";
import { toggleUserStatusSchema } from "./user.validation.js";

const router = express.Router();

router.use(adminAuthenticate);

router.get("/stats", userContainer.userController.getUserStats);
router.get("/", userContainer.userController.getAllUsers);
router.get("/:id", userContainer.userController.getUserById);
router.patch("/:id", validate(toggleUserStatusSchema), userContainer.userController.toggleUserStatus);

export default router;
