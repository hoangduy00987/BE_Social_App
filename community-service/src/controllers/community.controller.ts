import cloudinary from "@/configs/cloudinary.js";
import { CommunityService } from "@/services/community.service.js";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export class CommunityController {
    static async create(req: Request, res: Response) {
        try {
            const community = await CommunityService.createCommunity(req.body);
            res.status(201).json(community);
        } catch (err: any) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(409).json({
                        error: `Community name "${req.body.name}" already exists.`,
                    });
                }
            }

            res.status(500).json({ error: err.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        const community = await CommunityService.getAllCommunitys();
        res.json(community);
    };

    static async getAllCommunityCreatedBy(req: Request, res: Response) {
        const community = await CommunityService.getAllCommunityCreatedBy(req.body);
        res.json(community);
    };

    static async getById(req: Request, res: Response) {
        try {
            const name = req.params.id;
            const community = await CommunityService.getCommunityById(name);
            res.json(community);
        } catch(err: any) {
            res.status(404).json({ error: err.message });
        }
    };

    static async update(req: Request, res: Response) {
        try {
            const id_param = req.params.id;
            const data = req.body;

            const community = await CommunityService.updateCommunity(Number(id_param), data);
            res.json(community);
        } catch(err: any) {
            res.status(400).json({ error: err.message });
        }
    };

    static async delete(req: Request, res: Response) {
        await CommunityService._deleteCommunity(Number(req.params.id));
        res.status(204).send();
    };

    static async search(req: Request, res: Response) {
        const result = await CommunityService.searchCommunity(req.query.q as string);
        res.json(result);
    };

    static async topCommunity(req: Request, res: Response) {
        const result = await CommunityService.topCommunity();
        res.json(result);
    };

    static async joinedCommunity(req: Request, res: Response) {
        const user_id = req.params.id;
        const result = await CommunityService.joinedCommunity(Number(user_id));
        res.json(result);
    };

    static async uploadAvatar(req: Request, res: Response) {
        try {
            const community_id = Number(req.params.id);
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const b64 = Buffer.from(file.buffer).toString("base64");
            const dataURI = `data:${file.mimetype};base64,${b64}`;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "reddit-clone"
            });

            const uploadAvatar = await CommunityService.uploadAvatar(community_id, {
                avatar: result.secure_url
            });

            return res.json({
                message: 'Avatar uploaded successful',
                avatar: uploadAvatar
            });
        } catch(error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    static async deleteCommunity(req: Request, res: Response) {
        try {
            const community_id = req.params.id;
            const community = await CommunityService.deleteCommunity(Number(community_id));
            res.status(201).json(community);
        } catch(error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}