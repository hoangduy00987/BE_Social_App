import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserModel } from './models/user.model';

import { JwtStrategy } from './auth/jwt.strategy'; 
import { jwtConstants } from './config/jwt.config';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),   
    JwtModule.register({
      global: true,
      secret: jwtConstants.access_secret,
      signOptions: { expiresIn: jwtConstants.access_expires as any },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    UserModel,
    PrismaService,
    JwtStrategy,   
  ],
})
export class AppModule {}
