import { getProjects } from "@/controllers/project.controller.js";
import { Router } from "express";
const router: Router = Router();

router.get("/", getProjects);

export default router;