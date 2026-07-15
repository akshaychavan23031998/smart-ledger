import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

const transactionSelect = {
  id: true,
  userId: true,
  type: true,
  category: true,
  amountMinor: true,
  title: true,
  description: true,
  occurredAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TransactionSelect;

type SelectedTransaction = Prisma.TransactionGetPayload<{
  select: typeof transactionSelect;
}>;

function toBigIntAmount(value: number): bigint {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new BadRequestException(
      'amountMinor must be a positive safe integer',
    );
  }

  return BigInt(value);
}

function toSafeInteger(value: bigint): number {
  if (
    value > BigInt(Number.MAX_SAFE_INTEGER) ||
    value < BigInt(Number.MIN_SAFE_INTEGER)
  ) {
    throw new BadRequestException('amountMinor exceeds supported range');
  }

  return Number(value);
}

function serializeTransaction(transaction: SelectedTransaction) {
  return {
    ...transaction,
    amountMinor: toSafeInteger(transaction.amountMinor),
  };
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransactionDto) {
    const created = await this.prisma.transaction.create({
      data: {
        userId,
        type: dto.type,
        category: dto.category,
        amountMinor: toBigIntAmount(dto.amountMinor),
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        occurredAt: new Date(dto.occurredAt),
      },
      select: transactionSelect,
    });

    return serializeTransaction(created);
  }

  async list(userId: string, query: ListTransactionsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const search = query.search?.trim();
    const sortBy = query.sortBy ?? 'occurredAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.dateFrom || query.dateTo
        ? {
            occurredAt: {
              ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
              ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
            },
          }
        : {}),
    };

    const orderBy: Prisma.TransactionOrderByWithRelationInput[] = [
      {
        [sortBy]: sortOrder,
      },
      {
        id: 'asc',
      },
    ];

    const [total, items] = await this.prisma.$transaction([
      this.prisma.transaction.count({
        where,
      }),
      this.prisma.transaction.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: transactionSelect,
      }),
    ]);

    return {
      items: items.map(serializeTransaction),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOne(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      select: transactionSelect,
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return serializeTransaction(transaction);
  }

  async update(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('At least one field is required');
    }

    const existing = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    const data: Prisma.TransactionUpdateInput = {};

    if (dto.type !== undefined) {
      data.type = dto.type;
    }

    if (dto.category !== undefined) {
      data.category = dto.category;
    }

    if (dto.amountMinor !== undefined) {
      data.amountMinor = toBigIntAmount(dto.amountMinor);
    }

    if (dto.title !== undefined) {
      data.title = dto.title.trim();
    }

    if (dto.description !== undefined) {
      data.description = dto.description.trim() || null;
    }

    if (dto.occurredAt !== undefined) {
      data.occurredAt = new Date(dto.occurredAt);
    }

    const updated = await this.prisma.transaction.update({
      where: {
        id: existing.id,
      },
      data,
      select: transactionSelect,
    });

    return serializeTransaction(updated);
  }

  async delete(userId: string, transactionId: string): Promise<void> {
    const existing = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    await this.prisma.transaction.delete({
      where: {
        id: existing.id,
      },
    });
  }
}
