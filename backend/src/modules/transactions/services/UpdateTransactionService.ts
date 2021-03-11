import { getRepository } from 'typeorm';
import { toDate } from 'date-fns-tz';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';
import Category from '@modules/categories/infra/typeorm/entities/Category';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  id: string;
  provider_id: string;
  date: Date;
  copies: number;
  type: 'income' | 'outcome';
  value: number;
  category: string;
  title: string;
  description?: string;
  updated_at: Date;
}

@injectable()
class UpdateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    id,
    provider_id,
    date,
    copies,
    type,
    value,
    category,
    title,
    description,
  }: IRequest): Promise<void> {
    const categoryRepository = getRepository(Category);

    const transactionUpdatedAt = toDate(Date.now());

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category, provider_id },
    });

    if (!checkCategoryExists) {
      const categoryCreate = categoryRepository.create({
        title: category,
        provider_id,
      });
      await categoryRepository.save(categoryCreate);
    }

    const categoryId = await categoryRepository.findOne({
      where: { title: category, provider_id },
    });

    const transactionsRepository = getRepository(Transaction);

    const checkTransactionExists = await transactionsRepository.findOne({
      where: { id },
    });

    if (!checkTransactionExists) {
      throw new AppError('Transaction not found', 400);
    } else {
      await transactionsRepository
        .createQueryBuilder()
        .update()
        .set({
          provider_id,
          date,
          copies,
          type,
          value,
          category: categoryId,
          title,
          description,
          updated_at: transactionUpdatedAt,
        })
        .where('id = :id', { id })
        .execute();

      const year = date.getFullYear();

      await this.cacheProvider.invalidatePrefix(
        `list-transactions-${provider_id}:${year}`,
      );
    }
  }
}

export default UpdateTransactionService;
