import { CommunityModel } from "@/models/community.model.js";

export class CommunityService {
  static createCommunity(data: any) {
    return CommunityModel.create(data);
  }

  static getAllCommunitys() {
    return CommunityModel.findAll();
  }

  static async getAllCommunityCreatedBy(id: number) {
    const sub = await CommunityModel.findAllByCreatedId(id);
    return sub;
  }

  static async getCommunityById(community_id: number) {
    const sub = await CommunityModel.findById(community_id);
    if (!sub) throw new Error("Community not found");
    return sub;
  }

  static updateCommunity(id: number, data: any) {
    return CommunityModel.update(id, data);
  }

  static _deleteCommunity(id: number) {
    return CommunityModel.delete(id);
  }

  static searchCommunity(keyword: string) {
    return CommunityModel.search(keyword);
  }

  static topCommunity() {
    return CommunityModel.topCommunity();
  }

  static joinedCommunity(user_id: number) {
    return CommunityModel.joinedCommunity(user_id);
  }

  static uploadAvatar(id: number, data: any) {
    return CommunityModel.uploadAvatar(id, data);
  }

  static deleteCommunity(community_id: number) {
    return CommunityModel.deleteCommunity(community_id);
  }

  static async getCommunitiesBatch(ids: number[]) {
    console.log("start");
    const communities = await CommunityModel.findManyCommunites(ids);
    console.log("communities:", communities);

    const result: Record<number, any> = {};

    communities.forEach((c) => {
      result[c.community_id] = {
        community_id: c.community_id,
        name: c.name,
        avatar: c.avatar,
        type: c.communityType.type,
        members_count: c._count.members,
      };
    });

    console.log("result:", result);
    return result;
  }
}
