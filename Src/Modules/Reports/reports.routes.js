import express from "express";
import reportsController from "./reports.container.js";
import adminAuthenticate from "../../Middlewares/adminAuthenticate.js";

const router = express.Router();

router.use(adminAuthenticate);

router.get("/sales", (req, res) => reportsController.getSalesReport(req, res));
router.get("/orders", (req, res) => reportsController.getOrdersReport(req, res));
router.get("/users", (req, res) => reportsController.getUsersReport(req, res));
router.get("/products", (req, res) => reportsController.getProductsReport(req, res));
router.get("/vendors", (req, res) => reportsController.getVendorsReport(req, res));
router.get("/coupons", (req, res) => reportsController.getCouponsReport(req, res));

export default router;
