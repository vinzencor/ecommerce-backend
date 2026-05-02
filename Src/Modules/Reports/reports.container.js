import prisma from "../../Config/prismaClient.js";
import ReportsService from "./reports.service.js";
import ReportsController from "./reports.controller.js";

const reportsService = new ReportsService(prisma);
const reportsController = new ReportsController(reportsService);

export default reportsController;
