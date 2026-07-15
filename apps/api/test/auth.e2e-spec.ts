import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('Auth e2e', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('registers and returns the current user with a valid token', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        name: 'Akshay Chavan',
        email: 'akshay@example.com',
        password: 'StrongPassword123!',
      })
      .expect(201);

    const registerBody = registerResponse.body as {
      user: { email: string };
      accessToken: string;
    };

    expect(registerBody.user.email).toBe('akshay@example.com');
    expect(registerBody.accessToken).toBeDefined();

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${registerBody.accessToken}`)
      .expect(200);

    const meBody = meResponse.body as { email: string; passwordHash?: string };

    expect(meBody.email).toBe('akshay@example.com');
    expect(meBody.passwordHash).toBeUndefined();
  });

  it('rejects /auth/me without a token', async () => {
    await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
  });
});
