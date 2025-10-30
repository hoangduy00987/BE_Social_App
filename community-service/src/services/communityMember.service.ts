import { CommunityMemberModel } from "@/models/communityMember.model.js";


export class CommunityMemberService {
    static async joinCommunity(data: any) {
        return CommunityMemberModel.create(data);
    };

    static async getMembersById(community_id: number) {
        return CommunityMemberModel.getMembersById(community_id);
    };

    static async getMemberPending(community_id: number) {
        return CommunityMemberModel.getMemberPending(community_id);
    };

    static async approveRequest(community_id: number, user_id: number) {
        return CommunityMemberModel.approveRequest(community_id, user_id);
    };

    static async rejectRequest(community_id: number, user_id: number) {
        return CommunityMemberModel.rejectRequest(community_id, user_id);
    }
}