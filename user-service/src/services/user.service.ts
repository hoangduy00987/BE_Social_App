import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../config/jwt.config';
import { use } from 'passport';
import { ProfileDTO } from '../DTO/profile.dto'
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

  async getProfile(userId: number) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  async updateProfile(userId: number, dto: ProfileDTO) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    return this.userModel.updateProfile(userId, {
      full_name: dto.full_name,
      avatar: dto.avatar,
      gender: dto.gender,
    });
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


}
