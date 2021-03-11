import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  id: string;
  provider_id: string;
}

@injectable()
class DeleteCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private ormRepository: ICategoriesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ id, provider_id }: IRequest): Promise<void> {
    const checkCategoryExists = await this.ormRepository.findOneCategoryId({
      id,
    });

    if (!checkCategoryExists) {
      throw new AppError('Transaction not found', 400);
    } else {
      await this.ormRepository.delete({ id });

      await this.cacheProvider.invalidatePrefix(
        `list-transactions-${provider_id}`,
      );
    }
  }
}

export default DeleteCategoryService;
