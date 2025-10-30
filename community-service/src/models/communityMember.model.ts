import { prisma } from "@/configs/db.js";
import { Prisma } from "@prisma/client";


export class CommunityMemberModel {
    static async create(data: Prisma.CommunityMemberCreateInput) {
        return prisma.communityMember.create({ data });
    };

    static async getMembersById(community_id: number) {
        return prisma.communityMember.findMany({
            where: {
                community_id: community_id,
                status: 'APPROVED'
            }
        })
    };

    static async getMemberPending(community_id: number) {
        return prisma.communityMember.findMany({
            where: {
                community_id: community_id,
                status: 'PENDING'
            }
        });
    };

    static async approveRequest(community_id: number, user_id: number) {
        return prisma.communityMember.update({
            where: {
                community_id_user_id: {
                    community_id,
                    user_id,
                },
            },
            data: {
                status: 'APPROVED',
            },
        });
    };

    static async rejectRequest(community_id: number, user_id: number) {
        return prisma.communityMember.delete({
            where: {
                community_id_user_id: {
                    community_id,
                    user_id,
                },
            },
        });
    };
}