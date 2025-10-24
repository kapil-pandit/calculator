import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class JwtBlacklistGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If passport produced an error or no user -> reject
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }

    const req = context.switchToHttp().getRequest();
    const token = (req.headers.authorization || '').split(' ')[1];
    if (this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token is invalidated (logged out)');
    }

    return user;
  }
}
