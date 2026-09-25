import { sendContactMessage } from "@/controllers/contact.controller.js";
import { Router } from "express";
const router: Router = Router();

router.put("/", sendContactMessage);

export default router;