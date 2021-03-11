import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Category from '@modules/categories/infra/typeorm/entities/Category';
import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository';

interface ICategory {
  title: string;
  provider_id: string;
}

@injectable()
class CreateCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private ormRepository: ICategoriesRepository,
  ) {}

  public async execute({ title, provider_id }: ICategory): Promise<Category> {
    const checkCategoryExists = await this.ormRepository.findOneCategoryProvider(
      { title, provider_id },
    );

    if (!checkCategoryExists) {
      const category = this.ormRepository.create({
        title,
        provider_id,
      });

      return category;
    }

    throw new AppError('Título da categoria já existe');
  }
}

export default CreateCategoryService;
