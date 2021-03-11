import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  id: string;
  title: string;
  updated_at: Date;
  provider_id: string;
}

@injectable()
class UpdateCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private ormRepository: ICategoriesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ id, title, provider_id }: IRequest): Promise<void> {
    const checkCategoryExists = await this.ormRepository.findOneCategoryId({
      id,
    });

    const checkCategoryNameExists = await this.ormRepository.findOneCategoryTitle(
      { title },
    );

    if (checkCategoryNameExists) {
      throw new AppError('Já existe uma categoria com esse título', 400);
    }

    if (!checkCategoryExists) {
      throw new AppError('Categoria não encontrada', 400);
    } else {
      await this.ormRepository.update({ id, title });

      await this.cacheProvider.invalidatePrefix(
        `list-transactions-${provider_id}`,
      );
    }
  }
}

export default UpdateCategoryService;
