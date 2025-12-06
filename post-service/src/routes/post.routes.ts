import { Router } from "express";
import { PostController } from "../controllers/posts.controller.js";
import { authHandler, authPostOnlyHandler } from "../shared/middlewares/auth.middleware.js";
import upload from "../shared/middlewares/file.middleware.js";

const router = Router();
const controller = new PostController();

router.get("/", authPostOnlyHandler, controller.getAll);
router.post("/", authHandler, upload.single("file"), controller.create);

router.post("/save", authHandler, controller.save);
router.get("/saved", authHandler, controller.getAllMySaved);
router.get("/my-saved", authHandler, controller.getMySaved);
router.delete("/saved/:id", authHandler, controller.deleteSaved);

router.get("/by-user", authPostOnlyHandler, controller.getByUser);

router.get("/:id", authPostOnlyHandler, controller.getById);
router.put("/:id", authHandler, controller.update);
router.delete("/:id", authHandler, controller.delete);

export default router;
