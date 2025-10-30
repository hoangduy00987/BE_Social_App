import { CommunityMemberService } from "@/services/communityMember.service.js";
import { Request, Response } from "express";

export class CommunityMemberController {
    static async joinCommunity(req: Request, res: Response) {
        try {
            const community = await CommunityMemberService.joinCommunity(req.body);
            res.status(201).json(community);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getMembersById(req: Request, res: Response) {
        try {
            const community_id = req.params.id;
            const members = await CommunityMemberService.getMembersById(Number(community_id));
            res.status(200).json({ members });
        } catch(error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    static async getMemberPending(req: Request, res: Response) {
        try {
            const community_id = req.params.id;
            const members = await CommunityMemberService.getMemberPending(Number(community_id));
            res.status(200).json({ members });
        } catch(error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    static async approveRequest(req: Request, res: Response) {
        try {
            const { community_id, user_id } = req.params;
            const members = await CommunityMemberService.approveRequest(Number(community_id), Number(user_id));
            res.status(200).json({ members });
        } catch(error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    static async rejectRequest(req: Request, res: Response) {
        try {
            const { community_id, user_id } = req.params;
            const members = await CommunityMemberService.rejectRequest(Number(community_id), Number(user_id));
            res.status(200).json({ members });
        } catch(error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}