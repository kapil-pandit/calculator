import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  // Simple in-memory blacklist. For production, use Redis or DB.
  private tokenBlacklist = new Set<string>();

  constructor(private userService: UserService, private jwtService: JwtService) {}

  async register(email: string, password: string, name?: string) {
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');
    return this.userService.create(email, password, name);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;
    // do not return password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safe } = user as any;
    return safe;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { access_token: token, expires_in: this.jwtService.decode(token) } ;
  }

  logout(token: string) {
    if (!token) return;
    this.tokenBlacklist.add(token);
  }

  isTokenBlacklisted(token?: string) {
    if (!token) return true;
    return this.tokenBlacklist.has(token);
  }
}
