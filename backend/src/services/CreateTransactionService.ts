import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import CategoryModel from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  provider_id: string;
  date: Date;
  copies: number;
  type: 'income' | 'outcome';
  value: number;
  category: string;
  title: string;
  description?: string;
}

class CreateTransactionService {
  public async execute({
    provider_id,
    date,
    copies,
    type,
    value,
    title,
    description,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(CategoryModel);

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

    const transaction = transactionsRepository.create({
      provider_id,
      date,
      copies,
      type,
      value,
      title,
      description,
      category: categoryId,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
