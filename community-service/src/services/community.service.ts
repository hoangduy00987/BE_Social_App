import { CommunityModel } from "@/models/community.model.js";

export class CommunityService {
    static createCommunity(data: any) {
        return CommunityModel.create(data);
    };

    static getAllCommunitys() {
        return CommunityModel.findAll();
    };

    static async getAllCommunityCreatedBy(id: number) {
        const sub = await CommunityModel.findAllByCreatedId(id);
        return sub;
    }

    static async getCommunityById(name: string) {
        const sub =  await CommunityModel.findById(name);
        if(!sub)
            throw new Error('Community not found');
        return sub;
    };

    static updateCommunity(id: number, data: any) {
        return CommunityModel.update(id, data);
    };

    static _deleteCommunity(id: number) {
        return CommunityModel.delete(id);
    };

    static searchCommunity(keyword: string) {
        return CommunityModel.search(keyword);
    };

    static topCommunity() {
        return CommunityModel.topCommunity();
    };

    static joinedCommunity(user_id: number) {
        return CommunityModel.joinedCommunity(user_id);
    };

    static uploadAvatar(id: number, data: any) {
        return CommunityModel.uploadAvatar(id, data);
    };

    static deleteCommunity(community_id: number) {
        return CommunityModel.deleteCommunity(community_id);
    }
}