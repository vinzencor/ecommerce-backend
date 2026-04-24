import express from "express";
import notificationContainer from "./notification.container.js";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";
import upload from "../../Middlewares/upload.js";

import validate from "../../Middlewares/validate.js";
import { createNotificationSchema } from "./notification.validation.js";

const router = express.Router();
const { notificationController } = notificationContainer;


router.use(adminAuthenticate)
// Admin routes
router.post("/admin", upload.single("image"), validate(createNotificationSchema), notificationController.createNotification);
router.get("/admin", notificationController.getAdminNotifications);
router.get("/admin/:id", notificationController.getNotificationDetails);
router.delete("/admin/:id", notificationController.deleteNotification);



export default router;
