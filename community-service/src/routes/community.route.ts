import { Router } from "express";
import upload from "@/middlewares/upload.js";
import { CommunityController } from "@/controllers/community.controller.js";

const router = Router();

router.post('/', CommunityController.create);
router.get('/', CommunityController.getAll);
router.get('/by-created', CommunityController.getAllCommunityCreatedBy);
router.get('/top-community', CommunityController.topCommunity);
router.get("/joined-community/:id", CommunityController.joinedCommunity);
router.get("/search", CommunityController.search);
router.get("/:id", CommunityController.getById);
router.post("/:id/upload-avatar", upload.single("avatar"), CommunityController.uploadAvatar);
router.put("/:id", CommunityController.update);
// router.delete("/:id", CommunityController.delete);
router.delete('/:id', CommunityController.deleteCommunity);

export default router;