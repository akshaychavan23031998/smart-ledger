/// <reference types="jest" />

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { TransactionsService } from './transactions.service';

type AsyncMock<TArgs extends unknown[], TResult> = jest.Mock<
  Promise<TResult>,
  TArgs
>;

type MockCallHistory = {
  mock: {
    calls: Array<unknown[]>;
  };
};

type TransactionRecord = {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE';
  category: 'FOOD';
  amountMinor: bigint;
  title: string;
  description: string | null;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

type CreatePayload = {
  data?: {
    userId?: string;
  };
};

type CountPayload = {
  where?: {
    userId?: string;
  };
};

type FindManyPayload = {
  skip?: number;
  take?: number;
  where?: {
    userId?: string;
    type?: string;
    category?: string;
    OR?: Array<{
      title?: {
        contains?: string;
        mode?: string;
      };
      description?: {
        contains?: string;
        mode?: string;
      };
    }>;
    occurredAt?: {
      gte?: Date;
      lte?: Date;
    };
  };
};

function getMockFirstArg<T>(mockLike: unknown): T | undefined {
  const history = mockLike as MockCallHistory;
  const firstCall = history.mock.calls[0];

  return firstCall?.[0] as T | undefined;
}

function createTransactionRecord(
  overrides: Partial<TransactionRecord> = {},
): TransactionRecord {
  const timestamp = new Date('2026-07-15T18:30:00.000Z');

  return {
    id: 'tx-1',
    userId: 'user-1',
    type: 'EXPENSE',
    category: 'FOOD',
    amountMinor: 12500n,
    title: 'Dinner',
    description: 'Dinner with friends',
    occurredAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

describe('TransactionsService', () => {
  let service: TransactionsService;

  let prisma: {
    transaction: {
      create: AsyncMock<[unknown], unknown>;
      count: AsyncMock<[unknown], unknown>;
      findMany: AsyncMock<[unknown], unknown>;
      findFirst: AsyncMock<[unknown], unknown>;
      update: AsyncMock<[unknown], unknown>;
      delete: AsyncMock<[unknown], unknown>;
    };
    $transaction: AsyncMock<[unknown[]], [number, unknown[]]>;
  };

  beforeEach(async () => {
    prisma = {
      transaction: {
        create: jest.fn<Promise<unknown>, [unknown]>(),
        count: jest.fn<Promise<unknown>, [unknown]>(),
        findMany: jest.fn<Promise<unknown>, [unknown]>(),
        findFirst: jest.fn<Promise<unknown>, [unknown]>(),
        update: jest.fn<Promise<unknown>, [unknown]>(),
        delete: jest.fn<Promise<unknown>, [unknown]>(),
      },
      $transaction: jest.fn<Promise<[number, unknown[]]>, [unknown[]]>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(TransactionsService);
  });

  it('create assigns authenticated userId', async () => {
    prisma.transaction.create.mockResolvedValue(createTransactionRecord());

    const result = await service.create('user-1', {
      type: 'EXPENSE',
      category: 'FOOD',
      amountMinor: 12500,
      title: 'Dinner',
      description: 'Dinner with friends',
      occurredAt: '2026-07-15T18:30:00.000Z',
    });

    const createPayload = getMockFirstArg<CreatePayload>(
      prisma.transaction.create,
    );

    expect(createPayload?.data?.userId).toBe('user-1');
    expect(result.amountMinor).toBe(12500);
  });

  it('list applies ownership filter', async () => {
    prisma.$transaction.mockResolvedValue([2, []]);

    await service.list('user-1', {
      page: 1,
      limit: 20,
    });

    const countPayload = getMockFirstArg<CountPayload>(
      prisma.transaction.count,
    );

    const findManyPayload = getMockFirstArg<FindManyPayload>(
      prisma.transaction.findMany,
    );

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(countPayload?.where?.userId).toBe('user-1');
    expect(findManyPayload?.where?.userId).toBe('user-1');
  });

  it('list applies pagination and filters', async () => {
    prisma.$transaction.mockResolvedValue([
      3,
      [createTransactionRecord({ amountMinor: 100n })],
    ]);

    await service.list('user-1', {
      page: 2,
      limit: 10,
      search: 'food',
      type: 'EXPENSE',
      category: 'FOOD',
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
      sortBy: 'occurredAt',
      sortOrder: 'desc',
    });

    const findManyPayload = getMockFirstArg<FindManyPayload>(
      prisma.transaction.findMany,
    );

    expect(findManyPayload?.skip).toBe(10);
    expect(findManyPayload?.take).toBe(10);
    expect(findManyPayload?.where?.userId).toBe('user-1');
    expect(findManyPayload?.where?.type).toBe('EXPENSE');
    expect(findManyPayload?.where?.category).toBe('FOOD');

    expect(findManyPayload?.where?.OR).toEqual([
      {
        title: {
          contains: 'food',
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: 'food',
          mode: 'insensitive',
        },
      },
    ]);

    expect(findManyPayload?.where?.occurredAt?.gte).toEqual(
      new Date('2026-01-01'),
    );

    expect(findManyPayload?.where?.occurredAt?.lte).toEqual(
      new Date('2026-12-31'),
    );
  });

  it('returns an owned transaction', async () => {
    prisma.transaction.findFirst.mockResolvedValue(
      createTransactionRecord({
        id: 'tx-owned',
      }),
    );

    const result = await service.getOne('user-1', 'tx-owned');

    expect(result.id).toBe('tx-owned');
    expect(result.userId).toBe('user-1');
    expect(result.amountMinor).toBe(12500);
  });

  it('rejects a missing or non-owned transaction', async () => {
    prisma.transaction.findFirst.mockResolvedValue(null);

    await expect(service.getOne('user-1', 'tx-1')).rejects.toMatchObject({
      response: {
        statusCode: 404,
      },
    });
  });

  it('update enforces ownership', async () => {
    prisma.transaction.findFirst.mockResolvedValue(null);

    await expect(
      service.update('user-1', 'tx-1', {
        title: 'Updated',
      }),
    ).rejects.toMatchObject({
      response: {
        statusCode: 404,
      },
    });
  });

  it('delete enforces ownership', async () => {
    prisma.transaction.findFirst.mockResolvedValue(null);

    await expect(service.delete('user-1', 'tx-1')).rejects.toMatchObject({
      response: {
        statusCode: 404,
      },
    });
  });

  it('rejects amountMinor outside the safe integer range', async () => {
    await expect(
      service.create('user-1', {
        type: 'EXPENSE',
        category: 'FOOD',
        amountMinor: Number.MAX_SAFE_INTEGER + 1,
        title: 'Dinner',
        description: 'Dinner',
        occurredAt: '2026-07-15T18:30:00.000Z',
      }),
    ).rejects.toMatchObject({
      response: {
        statusCode: 400,
      },
    });

    expect(prisma.transaction.create).not.toHaveBeenCalled();
  });

  it('rejects BigInt values that cannot be serialized safely', async () => {
    prisma.transaction.findFirst.mockResolvedValue(
      createTransactionRecord({
        amountMinor: BigInt(Number.MAX_SAFE_INTEGER) + 1n,
      }),
    );

    await expect(service.getOne('user-1', 'tx-1')).rejects.toMatchObject({
      response: {
        statusCode: 400,
      },
    });
  });
});
