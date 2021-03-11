import { injectable, inject } from 'tsyringe';

import Category from '@modules/categories/infra/typeorm/entities/Category';
import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository';

@injectable()
export default class ListCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private ormRepository: ICategoriesRepository,
  ) {}

  public async execute(): Promise<Category[]> {
    const categories = await this.ormRepository.findAllAndOrder();

    return categories;
  }
}
