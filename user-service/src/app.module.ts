import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserModel } from './models/user.model';
import { jwtConstants } from './config/jwt.config';

@Module({
  imports: [
    JwtModule.register({
      global: true, // cho phép dùng ở mọi service
      secret: jwtConstants.access_secret,
      signOptions: { expiresIn: jwtConstants.access_expires as any },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserModel, PrismaService],
})
export class AppModule {}
