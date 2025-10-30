import { prisma } from "@/configs/db.js";


export class CommunityTypeModel {
    static async findAll() {
        return prisma.communityType.findMany();
    }
}