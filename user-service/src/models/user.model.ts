import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserModel {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

    async findById(id: number): Promise<User | null> {
  return this.prisma.user.findUnique({
    where: { id },
    include: {
      profile: true, 
    },
  });


  }
   async findByUserId(userId: number) {
    return this.prisma.profile.findUnique({
      where: { user_id: userId },
    });
  }
async updateProfile(id: number, data: any) {
  return this.prisma.profile.update({
    where: { user_id: id },
    data,
  });
}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
      include: { profile: true },
    });
  }
}
