import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validate(@Req() req, @Res() res) {
    res.setHeader('X-User-ID', req.user.id);
    return res.send({ valid: true });
  }
}
