import { CommunityTypeController } from "@/controllers/communityType.controller.js";
import { Router } from "express";

const router = Router();

router.get('/', CommunityTypeController.getAll);

export default router;