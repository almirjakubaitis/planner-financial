import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';
import Category from '@modules/categories/infra/typeorm/entities/Category';

import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';
import ICreateCategoryDTO from '@modules/categories/dtos/ICreateCategoryDTO';

export default interface ITransactionsRepository {
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  createCategory(data: ICreateCategoryDTO): Promise<Category>;

  findAll(provider_id: string): Promise<Transaction[]>;
  findAllOrderTitleAndDate(provider_id: string): Promise<Transaction[]>;

  findManyTransactions(): Promise<Transaction[]>;
  findManyCategories(): Promise<Category[]>;

  findOneCategoryProvider(
    provider_id: string,
    category: string,
  ): Promise<unknown>;
}
