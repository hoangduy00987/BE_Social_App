import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../config/jwt.config';

@Injectable()
export class UserService {
  constructor(
    private readonly userModel: UserModel,
    private readonly jwtService: JwtService,
  ) {}

  // ============ HÀM ĐĂNG KÝ (bạn đã có rồi) ============
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

  // ============ HÀM ĐĂNG NHẬP ============
  async login(email: string, password: string) {
    // 1️⃣ Tìm user theo email
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2️⃣ So sánh mật khẩu người dùng nhập vào
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3️⃣ Sinh token và trả kết quả
    return this.generateAuthResponse(user);
  }

  // ============ HÀM TẠO TOKEN VÀ TRẢ VỀ RESPONSE ============
  private async generateAuthResponse(user: any) {
    const payload = { sub: user.id, email: user.email };

    // Access token
    const access_token = await this.jwtService.signAsync(payload as any, {
      secret: jwtConstants.access_secret as any,
      expiresIn: jwtConstants.access_expires as any,
    });

    // Refresh token
    const refresh_token = await this.jwtService.signAsync(payload as any, {
      secret: jwtConstants.refresh_secret as any,
      expiresIn: jwtConstants.refresh_expires as any,
    });

    // Loại bỏ password trước khi trả về
    const { password: _, ...safeUser } = user as any;

    return {
      user: safeUser,
      access_token,
      refresh_token,
    };
  }
}
