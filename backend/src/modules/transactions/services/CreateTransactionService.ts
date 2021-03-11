import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';

import { injectable, inject } from 'tsyringe';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider_id: string;
  date: Date;
  copies: number;
  type: 'income' | 'outcome';
  value: number;
  category: string;
  title: string;
  description?: string;
}

@injectable()
export default class CreateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private ormRepository: ITransactionsRepository, // categoryRepository: ICategoriesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    date,
    copies,
    type,
    value,
    title,
    description,
    category,
  }: IRequest): Promise<Transaction> {

    const checkCategoryExists = await this.ormRepository.findOneCategoryProvider(
      provider_id,
      category,
    );

    if (!checkCategoryExists) {
      await this.ormRepository.createCategory({
        title: category,
        provider_id,
      });
    }

    const categoryId: any = await this.ormRepository.findOneCategoryProvider(
      provider_id,
      category,
    );

    const transaction = this.ormRepository.create({
      provider_id,
      date,
      copies,
      type,
      value,
      title,
      description,
      category_id: categoryId.id,
    });

    const year = date.getFullYear();

    await this.cacheProvider.invalidatePrefix(
      `list-transactions-${provider_id}:${year}`,
    );

    return transaction;
  }
}
