import Category from '@modules/categories/infra/typeorm/entities/Category';
import ICreateCategoryDTO from '@modules/categories/dtos/ICreateCategoryDTO';
import {
  IUpdateCategoryIdDTO,
  IUpdateCategoryTitleDTO,
  IUpdateCategoryDTO,
} from '@modules/categories/dtos/IUpdateCategoryDTO';

import IListCategoryProviderDTO from '@modules/categories/dtos/IListCategoryProviderDTO';

export default interface ICategoriesRepository {
  create({ title, provider_id }: ICreateCategoryDTO): Promise<Category>;

  findManyCategories(): Promise<Category[]>;

  findAllAndOrder(): Promise<Category[]>;

  findAllProviderAndOrder({
    provider_id,
  }: IListCategoryProviderDTO): Promise<Category[]>;

  findOneCategoryProvider({
    title,
    provider_id,
  }: ICreateCategoryDTO): Promise<Category | undefined>;

  findOneCategoryId({
    id,
  }: IUpdateCategoryIdDTO): Promise<Category | undefined>;
  findOneCategoryTitle({
    title,
  }: IUpdateCategoryTitleDTO): Promise<Category | undefined>;

  update({ id, title }: IUpdateCategoryDTO): Promise<void>;

  delete({ id }: IUpdateCategoryIdDTO): Promise<void>;
}
