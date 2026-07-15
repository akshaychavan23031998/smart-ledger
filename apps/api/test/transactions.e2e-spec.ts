import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

function makeAuthHeader(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

describe('Transactions e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let firstUserToken: string;
  let secondUserToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);

    const firstUser = await prisma.user.create({
      data: {
        name: 'First User',
        email: 'first@example.com',
        passwordHash: 'hash',
      },
    });

    const secondUser = await prisma.user.create({
      data: {
        name: 'Second User',
        email: 'second@example.com',
        passwordHash: 'hash',
      },
    });

    firstUserToken = jwtService.sign({
      sub: firstUser.id,
      email: firstUser.email,
    });
    secondUserToken = jwtService.sign({
      sub: secondUser.id,
      email: secondUser.email,
    });
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
  });

  it('returns 401 for unauthenticated requests', async () => {
    await request(app.getHttpServer() as Parameters<typeof request>[0])
      .get('/api/v1/transactions')
      .expect(401);
  });

  it('allows an authenticated user to create and retrieve a transaction', async () => {
    const createResponse = await request(
      app.getHttpServer() as Parameters<typeof request>[0],
    )
      .post('/api/v1/transactions')
      .set(makeAuthHeader(firstUserToken))
      .send({
        type: 'EXPENSE',
        category: 'FOOD',
        amountMinor: 12500,
        title: 'Dinner',
        description: 'Dinner with friends',
        occurredAt: '2026-07-15T18:30:00.000Z',
      })
      .expect(201);

    const createBody = createResponse.body as {
      id: string;
      userId: string;
      amountMinor: number;
      passwordHash?: string;
    };

    expect(createBody.userId).toBeDefined();
    expect(createBody.amountMinor).toBe(12500);
    expect(createBody.passwordHash).toBeUndefined();

    const listResponse = await request(
      app.getHttpServer() as Parameters<typeof request>[0],
    )
      .get('/api/v1/transactions')
      .set(makeAuthHeader(firstUserToken))
      .expect(200);

    const listBody = listResponse.body as {
      items: Array<{ id: string }>;
    };

    expect(listBody.items).toHaveLength(1);

    const getResponse = await request(
      app.getHttpServer() as Parameters<typeof request>[0],
    )
      .get(`/api/v1/transactions/${createBody.id}`)
      .set(makeAuthHeader(firstUserToken))
      .expect(200);

    const getBody = getResponse.body as { title: string };

    expect(getBody.title).toBe('Dinner');
  });

  it('denies cross-user access to another user transaction', async () => {
    const createResponse = await request(
      app.getHttpServer() as Parameters<typeof request>[0],
    )
      .post('/api/v1/transactions')
      .set(makeAuthHeader(firstUserToken))
      .send({
        type: 'EXPENSE',
        category: 'FOOD',
        amountMinor: 900,
        title: 'Coffee',
        description: 'Coffee',
        occurredAt: '2026-07-15T18:30:00.000Z',
      })
      .expect(201);

    const createId = (createResponse.body as { id: string }).id;

    await request(app.getHttpServer() as Parameters<typeof request>[0])
      .get(`/api/v1/transactions/${createId}`)
      .set(makeAuthHeader(secondUserToken))
      .expect(404);
  });

  it('supports filtering and pagination', async () => {
    for (let index = 0; index < 3; index += 1) {
      await request(app.getHttpServer() as Parameters<typeof request>[0])
        .post('/api/v1/transactions')
        .set(makeAuthHeader(firstUserToken))
        .send({
          type: 'EXPENSE',
          category: 'FOOD',
          amountMinor: 100 + index,
          title: `Food ${index}`,
          description: 'Food item',
          occurredAt: '2026-07-15T18:30:00.000Z',
        })
        .expect(201);
    }

    const listResponse = await request(
      app.getHttpServer() as Parameters<typeof request>[0],
    )
      .get(
        '/api/v1/transactions?page=1&limit=2&search=Food&type=EXPENSE&category=FOOD',
      )
      .set(makeAuthHeader(firstUserToken))
      .expect(200);

    const listBody = listResponse.body as {
      items: Array<{ id: string }>;
      pagination: { total: number; totalPages: number };
    };

    expect(listBody.items).toHaveLength(2);
    expect(listBody.pagination.total).toBe(3);
    expect(listBody.pagination.totalPages).toBe(2);
  });

  it('allows update and delete for the authenticated user', async () => {
    const createResponse = await request(
      app.getHttpServer() as Parameters<typeof request>[0],
    )
      .post('/api/v1/transactions')
      .set(makeAuthHeader(firstUserToken))
      .send({
        type: 'EXPENSE',
        category: 'FOOD',
        amountMinor: 1300,
        title: 'Taxi',
        description: 'Taxi ride',
        occurredAt: '2026-07-15T18:30:00.000Z',
      })
      .expect(201);

    const createId = (createResponse.body as { id: string }).id;

    await request(app.getHttpServer() as Parameters<typeof request>[0])
      .patch(`/api/v1/transactions/${createId}`)
      .set(makeAuthHeader(firstUserToken))
      .send({ title: 'Taxi updated' })
      .expect(200);

    await request(app.getHttpServer() as Parameters<typeof request>[0])
      .delete(`/api/v1/transactions/${createId}`)
      .set(makeAuthHeader(firstUserToken))
      .expect(204);
  });
});
