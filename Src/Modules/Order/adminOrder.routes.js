import express from "express";
import orderController from "./order.container.js";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";

const router = express.Router();

router.use(adminAuthenticate);

router.get("/", (req, res) => orderController.getAllOrders(req, res));
router.get("/:id", (req, res) => orderController.getOrderByIdAdmin(req, res));
router.patch("/:id/status", (req, res) => orderController.updateOrderStatus(req, res));

export default router;
