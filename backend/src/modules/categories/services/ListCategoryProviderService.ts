import { injectable, inject } from 'tsyringe';

import Category from '@modules/categories/infra/typeorm/entities/Category';
import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository';
import IListCategoryProviderDTO from '@modules/categories/dtos/IListCategoryProviderDTO';

@injectable()
export default class ListCategoryProviderService {
  constructor(
    @inject('CategoriesRepository')
    private ormRepository: ICategoriesRepository,
  ) {}

  public async execute({
    provider_id,
  }: IListCategoryProviderDTO): Promise<Category[]> {
    const categories = await this.ormRepository.findAllProviderAndOrder({
      provider_id,
    });

    return categories;
  }
}
