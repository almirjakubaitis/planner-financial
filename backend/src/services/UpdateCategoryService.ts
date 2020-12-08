import { getRepository } from 'typeorm';
import { toDate } from 'date-fns-tz';

import CategoryModel from '../models/Category';

import AppError from '../errors/AppError';

interface Request {
  id: string;
  title: string;
  updated_at: Date;
}

class UpdateCategoryService {
  public async execute({ id, title }: Request): Promise<void> {
    const categoryRepository = getRepository(CategoryModel);

    const updatedAt = toDate(Date.now());

    const checkCategoryExists = await categoryRepository.findOne({
      where: { id },
    });

    const checkCategoryNameExists = await categoryRepository.findOne({
      where: { title },
    });

    if (checkCategoryNameExists) {
      throw new AppError('Já existe uma categoria com esse título', 400);
    }

    if (!checkCategoryExists) {
      throw new AppError('Transaction not found', 400);
    } else {
      await categoryRepository
        .createQueryBuilder()
        .update()
        .set({ title, updated_at: updatedAt })
        .where('id = :id', { id })
        .execute();
    }
  }
}

export default UpdateCategoryService;
