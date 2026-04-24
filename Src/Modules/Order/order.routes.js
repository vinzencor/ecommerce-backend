import express from "express";
import orderController from "./order.container.js";
import authenticate from "../../Middlewares/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.post("/", (req, res) => orderController.placeOrder(req, res));
router.get("/", (req, res) => orderController.getMyOrders(req, res));
router.get("/:id", (req, res) => orderController.getOrderById(req, res));

export default router;
