import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../config/jwt.config';
import { use } from 'passport';
import { ProfileDTO } from '../DTO/profile.dto'
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(
    private readonly userModel: UserModel,
    private readonly jwtService: JwtService,
  ) { }

  async register(email: string, password: string, full_name: string) {
    const existing = await this.userModel.findByEmail(email);
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.createUser({
      email,
      password: hashedPassword,
      profile: { create: { full_name } },
    });

    return this.generateAuthResponse(user);
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateAuthResponse(user);
  }

  async getProfile(userId: number): Promise<any> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  async updateProfile(
    userId: number,
    dto: ProfileDTO,
    file?: Express.Multer.File,
  ) {
    const profile = await this.userModel.findByUserId(userId);
    if (dto.gender !== undefined && dto.gender !== null) {
      const genderString = dto.gender.toString();
      const genderBool = genderString === "1";

      dto.gender = genderBool as any;
    }


    if (!profile) {
      throw new UnauthorizedException('Profile not found');
    }

    let avatar = profile.avatar;

    // Nếu upload avatar mới
    if (file) {
      // XÓA avatar cũ nếu có
      if (profile.avatar) {
        const oldPath = join(
          __dirname,
          '..',
          '..',
          'uploads',
          'avatar',
          profile.avatar,
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      avatar = file.filename;
    }

    // Gọi model để update
    const updatedProfile = await this.userModel.updateProfile(userId, {
      full_name: dto.full_name,
      gender: dto.gender,
      avatar: avatar,
    });

    const udProfile = {
      ...updatedProfile,
      avatar: updatedProfile.avatar ? `${process.env.BASE_URL}/uploads/avatar/${updatedProfile.avatar}` : ''
    }
    return udProfile;
  }


  private async generateAuthResponse(user: any) {
    const payload = { sub: user.id, email: user.email };

    const access_token = await this.jwtService.signAsync(payload as any, {
      secret: jwtConstants.access_secret as any,
      expiresIn: jwtConstants.access_expires as any,
    });

    const refresh_token = await this.jwtService.signAsync(payload as any, {
      secret: jwtConstants.refresh_secret as any,
      expiresIn: jwtConstants.refresh_expires as any,
    });

    return {
      is_admin: user.is_admin,
      access_token,
      refresh_token,
    };
  }

  async getUsersBatch(ids: number[]) {
    const users = await this.userModel.findManyUsers(ids);

    // Convert to map for faster lookup
    const result: Record<number, any> = {};
    users.forEach(u => {
      result[u.id] = {
        id: u.id,
        email: u.email,
        full_name: u.profile?.full_name ?? null,
        avatar: u.profile?.avatar ? `${process.env.BASE_URL}/uploads/avatar/${u.profile?.avatar}` : null
      };
    });

    return result;
  }

}
