import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import { AuthService } from './auth.service';

jest.mock('argon2', () => ({
  __esModule: true,
  hash: jest.fn().mockResolvedValue('hashed-password'),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      create: jest.Mock;
      findUnique: jest.Mock;
    };
  };
  let jwt: { sign: jest.Mock };

  beforeEach(async () => {
    jest.clearAllMocks();
    (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');

    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    jwt = {
      sign: jest.fn().mockReturnValue('token-value'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: JwtService,
          useValue: jwt,
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              if (key === 'JWT_SECRET')
                return 'super-secret-key-that-is-long-enough';
              if (key === 'JWT_EXPIRES_IN') return '15m';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('registers a user and returns an access token', async () => {
    prisma.user.create.mockResolvedValue({
      id: 'user-1',
      name: 'Akshay Chavan',
      email: 'akshay@example.com',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    });

    const result = await service.register({
      name: 'Akshay Chavan',
      email: 'akshay@example.com',
      password: 'StrongPassword123!',
    });

    expect(result.accessToken).toBe('token-value');
    expect(result.user.email).toBe('akshay@example.com');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('rejects duplicate registration', async () => {
    prisma.user.create.mockRejectedValue({ code: 'P2002' });

    await expect(
      service.register({
        name: 'Akshay Chavan',
        email: 'akshay@example.com',
        password: 'StrongPassword123!',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in a user with correct credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Akshay Chavan',
      email: 'akshay@example.com',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=1$testhash',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    });

    (argon2.verify as jest.Mock).mockResolvedValue(true);

    const result = await service.login({
      email: 'akshay@example.com',
      password: 'StrongPassword123!',
    });

    expect(result.accessToken).toBe('token-value');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects invalid login credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Akshay Chavan',
      email: 'akshay@example.com',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=1$testhash',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    });

    (argon2.verify as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({
        email: 'akshay@example.com',
        password: 'WrongPassword123!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
