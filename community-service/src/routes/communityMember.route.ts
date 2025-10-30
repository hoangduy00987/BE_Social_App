import { Router } from "express";
import { CommunityMemberController } from "@/controllers/communityMember.controller.js";

const router = Router();

router.post('/', CommunityMemberController.joinCommunity);
router.get("/:id", CommunityMemberController.getMembersById);
router.get('/pending/:id', CommunityMemberController.getMemberPending);
router.patch('/:community_id/approve-member/:user_id', CommunityMemberController.approveRequest);
router.delete('/:community_id/reject-member/:user_id', CommunityMemberController.rejectRequest);

export default router;