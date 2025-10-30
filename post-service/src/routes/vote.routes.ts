import { Router } from "express";
import { VoteController } from "../controllers/votes.controller";
import { authHandler } from "../shared/middlewares/auth.middleware";

const router = Router();
const controller = new VoteController();

router.post("/upsert", authHandler, controller.createVote);
router.get("/my-vote", authHandler, controller.getMyVote);

export default router;
