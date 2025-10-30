import { CommunityTypeService } from "@/services/communityType.service.js";
import { Request, Response } from "express";


export class CommunityTypeController {
    static async getAll(req: Request, res: Response) {
        const community_type = await CommunityTypeService.getAllCommunityType();
        res.json(community_type);
    }
}