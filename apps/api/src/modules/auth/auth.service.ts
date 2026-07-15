import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import type { AuthenticatedUser } from './types/authenticated-user.type';
import type { JwtPayload } from './types/jwt-payload.type';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

export interface AuthResponse {
  user: AuthenticatedUser;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const normalizedName = dto.name.trim();
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedPassword = dto.password.trim();

    const passwordHash = await argon2.hash(normalizedPassword, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });

    try {
      const createdUser = await this.prisma.user.create({
        data: {
          name: normalizedName,
          email: normalizedEmail,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      const accessToken = this.signAccessToken(
        createdUser.id,
        createdUser.email,
      );

      return {
        user: createdUser,
        accessToken,
      };
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Email already registered');
      }

      throw error;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedPassword = dto.password.trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        createdAt: true,
      },
    });

    const passwordMatches =
      user !== null &&
      (await argon2.verify(user.passwordHash, normalizedPassword));

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.signAccessToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  async getCurrentUser(userId: string): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  private signAccessToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    return this.jwtService.sign(payload);
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    );
  }
}
