import { getCustomRepository, getRepository } from 'typeorm';
import { toDate } from 'date-fns-tz';

import CategoryModel from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Request {
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

class UpdateTransactionService {
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
  }: Request): Promise<void> {
    const categoryRepository = getRepository(CategoryModel);

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

    const transactionsRepository = getCustomRepository(TransactionRepository);

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
    }
  }
}

export default UpdateTransactionService;
