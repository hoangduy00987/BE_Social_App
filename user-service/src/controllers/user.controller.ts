import { Body, Controller, Post, Get, Req, UseGuards, UsePipes, ValidationPipe, Put, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IsEmail, IsNotEmpty, MinLength, IsString, IsBoolean, IsOptional } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileDTO } from '../DTO/profile.dto'
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  full_name: string;
}
// === DTO cho Đăng nhập ===
class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() body: RegisterDto) {
    return this.userService.register(body.email, body.password, body.full_name);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() body: LoginDto) {
    return this.userService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const user = await this.userService.getProfile(req.user.id);

    const profile = {
      ...user.profile,
      avatar: user.profile.avatar ? `${process.env.BASE_URL}/uploads/avatar/${user.profile.avatar}` : ''
    }
    const avtUser = { ...user, profile }
    return avtUser;
  }
  
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatar',
        filename: (req, file, callback) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async updateProfile(
    @Body() dto: ProfileDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const userId = req.user.id;

    const profile = await this.userService.updateProfile(
      userId,
      dto,
      file,
    );

    return {
      message: 'Profile updated successfully',
      profile
    }


  }

  @Post("batch")
  async getUsersBatch(@Body("ids") ids: number[]) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException("ids must be an array");
    }

    return this.userService.getUsersBatch(ids);
  }

}
