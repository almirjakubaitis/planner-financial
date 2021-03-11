import { Repository, getRepository } from 'typeorm';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';
import ICreateCategoryDTO from '@modules/categories/dtos/ICreateCategoryDTO';

import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';
import CategoryModel from '@modules/categories/infra/typeorm/entities/Category';

// DTO (data transfer object)

// removidos com a ineção de dependência
// @EntityRepository(Transaction)
// class TransactionsRepository extends Repository<Transaction>
class TransactionsRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;

  private ormCategoryRepository: Repository<CategoryModel>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
    this.ormCategoryRepository = getRepository(CategoryModel);
  }

  public async findAll(provider_id: string): Promise<Transaction[]> {
    const transactions = await this.ormRepository.find({
      where: {
        provider_id,
      },
    });

    return transactions;
  }

  public async findAllOrderTitleAndDate(
    provider_id: string,
  ): Promise<Transaction[]> {
    const transactions = await this.ormRepository.find({
      where: {
        provider_id,
      },

      order: { title: 'ASC', date: 'ASC' },
    });

    return transactions;
  }

  public async findManyTransactions(): Promise<Transaction[]> {
    const transactions = await this.ormRepository
      .createQueryBuilder()
      .getMany();

    return transactions;
  }

  public async findOneCategoryProvider(
    provider_id: string,
    category: string,
  ): Promise<unknown> {
    const categories = await this.ormCategoryRepository.findOne({
      where: { title: category, provider_id },
    });

    return categories;
  }

  public async findManyCategories(): Promise<CategoryModel[]> {
    const categories = await this.ormCategoryRepository
      .createQueryBuilder()
      .getMany();

    return categories;
  }

  public async create({
    provider_id,
    date,
    copies,
    type,
    value,
    title,
    description,
    category_id,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create({
      provider_id,
      date,
      copies,
      type,
      value,
      title,
      description,
      category_id,
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }

  public async createCategory({
    title,
    provider_id,
  }: ICreateCategoryDTO): Promise<CategoryModel> {
    const category = this.ormCategoryRepository.create({ title, provider_id });

    await this.ormCategoryRepository.save(category);

    return category;
  }
}

export default TransactionsRepository;
