import { Router } from "express";
import { VoteController } from "../controllers/votes.controller.js";
import { authHandler } from "../shared/middlewares/auth.middleware.js";

const router = Router();
const controller = new VoteController();

router.post("/upsert", authHandler, controller.createVote);
router.post("/unvote", authHandler, controller.deleteVote);
router.get("/my-vote", authHandler, controller.getMyVote);

export default router;
