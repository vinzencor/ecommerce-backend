import { Router } from "express";
import supportController from "./support.container.js";
import authenticateUser from "../../Middlewares/authenticate.js";

const router = Router();

router.use(authenticateUser);

router.post("/tickets", supportController.createTicket.bind(supportController));
router.get("/tickets", supportController.getMyTickets.bind(supportController));
router.get("/tickets/:id", supportController.getTicketDetails.bind(supportController));
router.post("/tickets/:id/reply", supportController.replyToTicket.bind(supportController));

export default router;
