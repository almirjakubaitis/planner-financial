import { Repository, getRepository } from 'typeorm';
import { toDate } from 'date-fns-tz';

import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository';
import ICreateCategoryDTO from '@modules/categories/dtos/ICreateCategoryDTO';

import IListCategoryProviderDTO from '@modules/categories/dtos/IListCategoryProviderDTO';
import {
  IUpdateCategoryIdDTO,
  IUpdateCategoryTitleDTO,
  IUpdateCategoryDTO,
} from '@modules/categories/dtos/IUpdateCategoryDTO';

import Category from '@modules/categories/infra/typeorm/entities/Category';

// DTO (data transfer object)

// removidos com a injeção de dependência
// @EntityRepository(Transaction)
// class TransactionsRepository extends Repository<Transaction>
export default class CategoriesRepository implements ICategoriesRepository {
  private ormRepository: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Category);
  }

  public async create({
    title,
    provider_id,
  }: ICreateCategoryDTO): Promise<Category> {
    const category = this.ormRepository.create({
      title,
      provider_id,
    });

    await this.ormRepository.save(category);

    return category;
  }

  public async findAll(provider_id: string): Promise<Category[]> {
    const category = await this.ormRepository.find({
      where: {
        provider_id,
      },
      order: { title: 'ASC' },
    });

    return category;
  }

  public async findAllAndOrder(): Promise<Category[]> {
    const categories = await this.ormRepository.find({
      order: { title: 'ASC' },
    });

    return categories;
  }

  public async findAllProviderAndOrder({
    provider_id,
  }: IListCategoryProviderDTO): Promise<Category[]> {
    const categories = await this.ormRepository.find({
      where: {
        provider_id,
      },
      order: { title: 'ASC' },
    });
    return categories;
  }

  public async findManyCategories(): Promise<Category[]> {
    const categories = await this.ormRepository.createQueryBuilder().getMany();

    return categories;
  }

  public async findOneCategoryProvider({
    title,
    provider_id,
  }: ICreateCategoryDTO): Promise<Category | undefined> {
    const categories = await this.ormRepository.findOne({
      where: { title, provider_id },
    });

    return categories;
  }

  public async findOneCategoryId({
    id,
  }: IUpdateCategoryIdDTO): Promise<Category | undefined> {
    const category = await this.ormRepository.findOne({
      where: {
        id,
      },
    });
    return category;
  }

  public async findOneCategoryTitle({
    title,
  }: IUpdateCategoryTitleDTO): Promise<Category | undefined> {
    const category = await this.ormRepository.findOne({
      where: {
        title,
      },
    });
    return category;
  }

  public async update({ id, title }: IUpdateCategoryDTO): Promise<void> {
    const updatedAt = toDate(Date.now());
    await this.ormRepository
      .createQueryBuilder()
      .update()
      .set({ title, updated_at: updatedAt })
      .where('id = :id', { id })
      .execute();
  }

  public async delete({ id }: IUpdateCategoryIdDTO): Promise<void> {
    await this.ormRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
