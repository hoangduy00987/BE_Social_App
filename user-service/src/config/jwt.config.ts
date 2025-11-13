import { ConfigService } from '@nestjs/config';

export const jwtConstants = {
  access_secret: process.env.ACCESS_SECRET,
  refresh_secret: process.env.REFRESH_SECRET,
  access_expires: process.env.ACCESS_EXPIRES,
  refresh_expires: process.env.REFRESH_EXPIRES,
};
