import { Router } from "express";
import { PostController } from "../controllers/posts.controller";
import { authHandler } from "../shared/middlewares/auth.middleware";

const router = Router();
const controller = new PostController();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", authHandler, controller.create);
router.put("/:id", authHandler, controller.update);
router.delete("/:id", authHandler, controller.delete);

router.post("/save", authHandler, controller.save);
router.delete("/saved", authHandler, controller.deleteSaved);
router.get("/saved", authHandler, controller.getAllMySaved);
router.get("/saved/mine", authHandler, controller.getMySaved);

export default router;
