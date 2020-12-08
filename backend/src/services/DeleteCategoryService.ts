import { getRepository } from 'typeorm';

import CategoryModel from '../models/Category';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteCategoryService {
  public async execute({ id }: Request): Promise<void> {
    const categoryRepository = getRepository(CategoryModel);

    const checkCategoryExists = await categoryRepository.findOne({
      where: { id },
    });

    if (!checkCategoryExists) {
      throw new AppError('Transaction not found', 400);
    } else {
      await categoryRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute();
    }
  }
}

export default DeleteCategoryService;
