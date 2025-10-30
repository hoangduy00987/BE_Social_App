import { Router } from "express";
import { CommentController } from "../controllers/comments.controller";
import { authHandler } from "../shared/middlewares/auth.middleware";

const router = Router();
const controller = new CommentController();

router.get("/fetch", controller.fetchComments);
router.get("/fetch-replies", controller.fetchCommentReplies);
router.post("/create", authHandler, controller.createComment);
router.delete("/delete", authHandler, controller.deleteComment);

export default router;
