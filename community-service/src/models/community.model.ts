import { prisma } from "@/configs/db.js";
import { Prisma } from "@prisma/client";

export class CommunityModel {
  static async create(data: Prisma.CommunityCreateInput) {
    return prisma.community.create({ data });
  }

  static async findAll() {
    return prisma.community.findMany({
      include: {
        communityType: true,
      },
    });
  }

  static async findAllByCreatedId(created_by: number) {
    return prisma.community.findMany({
      where: { created_by: created_by },
    });
  }

  static async findByName(name: string) {
    const c = await prisma.community.findUnique({
      where: { name },
      include: {
        communityType: {
          select: { type: true },
        },
        _count: {
          select: {
            members: {
              where: { status: "APPROVED" },
            },
          },
        },
        members: {
          where: { status: "APPROVED" },
          select: { status: true },
        },
      },
    });

    if (!c) return null;

    return {
      community_id: c.community_id,
      name: c.name,
      created_by: c.created_by,
      avatar: c.avatar ?? "",
      type: c.communityType.type,
      members: c._count.members,
      created_at: c.created_at,
      status: c.members[0]?.status ?? null,
    };
  }

  static async findById(community_id: number) {
    const c = await prisma.community.findUnique({
      where: { community_id },
      include: {
        communityType: {
          select: { type: true },
        },
        _count: {
          select: {
            members: {
              where: { status: "APPROVED" },
            },
          },
        },
        members: {
          where: { status: "APPROVED" },
          select: { status: true },
        },
      },
    });

    if (!c) return null;

    return {
      community_id: c.community_id,
      name: c.name,
      created_by: c.created_by,
      avatar: c.avatar ?? "",
      type: c.communityType.type,
      members: c._count.members,
      created_at: c.created_at,
      status: c.members[0]?.status ?? null,
    };
  }

  static async update(community_id: number, data: Prisma.CommunityUpdateInput) {
    return prisma.community.update({
      where: { community_id: community_id },
      data,
    });
  }

  static async delete(community_id: number) {
    return prisma.community.delete({
      where: { community_id: community_id },
    });
  }

  static async search(keyword: string) {
    return prisma.community.findMany({
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      include: {
        communityType: true,
      },
    });
  }

  static async topCommunity() {
    const communities = await prisma.community.findMany({
      take: 10,
      orderBy: {
        members: {
          _count: "desc",
        },
      },
      include: {
        communityType: {
          select: { type: true },
        },
        _count: {
          select: { members: true },
        },
      },
    });

    return communities.map((c) => ({
      community_id: c.community_id,
      name: c.name,
      created_by: c.created_by,
      avatar: c.avatar,
      type: c.communityType.type,
      members: c._count.members,
      created_at: c.created_at,
    }));
  }

  static async joinedCommunity(user_id: number) {
    const memberships = await prisma.communityMember.findMany({
      where: {
        user_id,
        status: "APPROVED",
      },
      include: {
        community: {
          include: {
            communityType: { select: { type: true } },
            _count: { select: { members: true } },
          },
        },
      },
    });

    return memberships.map((m) => ({
      community_id: m.community.community_id,
      name: m.community.name,
      created_by: m.community.created_by,
      avatar: m.community.avatar ?? "",
      type: m.community.communityType.type,
      status: m.status,
      members: m.community._count.members,
      created_at: m.community.created_at,
    }));
  }

  static async uploadAvatar(
    community_id: number,
    data: Prisma.CommunityUpdateInput
  ) {
    return prisma.community.update({
      where: { community_id: community_id },
      data,
    });
  }

  static async deleteCommunity(community_id: number) {
    await prisma.communityMember.deleteMany({
      where: { community_id },
    });

    return prisma.community.delete({
      where: { community_id: community_id },
    });
  }

  static async findManyCommunites(ids: number[]) {
    const communities = await prisma.community.findMany({
      where: { community_id: { in: ids } },
      include: {
        communityType: { select: { type: true } },
        _count: {
          select: {
            members: { where: { status: "APPROVED" } },
          },
        },
      },
    });
    console.log("models:", communities);

    return communities;
  }
}
