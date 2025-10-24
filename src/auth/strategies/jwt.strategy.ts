import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private userService: UserService,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') || 'secretKey',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any, done: Function) {
    // `payload` contains signed data
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token: user not found');
    }
    // Check blacklist
    // Extract raw token from request is not available here, so `isTokenBlacklisted` check
    // will be done in a guard using request headers OR we implement a workaround:
    // Passport's validate doesn't provide token directly, therefore we will instead create
    // a separate guard that both extracts token and uses JWT strategy for validation.
    // For simplicity, return the user; blacklist will be checked in guard.
    // return user object attached to req.user
    // strip password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = user as any;
    return safe;
  }
}
