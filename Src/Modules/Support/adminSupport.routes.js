import { Router } from "express";
import supportController from "./support.container.js";
import authenticateAdmin from "../../Middlewares/adminAuthenticate.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/tickets", supportController.getAllTickets.bind(supportController));
router.get("/tickets/:id", supportController.getTicketDetails.bind(supportController));
router.patch("/tickets/:id/status", supportController.updateStatus.bind(supportController));
router.post("/tickets/:id/reply", supportController.replyToTicket.bind(supportController));

export default router;
