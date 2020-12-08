import { getRepository } from 'typeorm';
import CategoryModel from '../models/Category';

import AppError from '../errors/AppError';

interface Category {
  title: string;
  provider_id: string;
}

class CreateCategoryService {
  public async execute({
    title,
    provider_id,
  }: Category): Promise<CategoryModel> {
    const categoryRepository = getRepository(CategoryModel);

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title, provider_id },
    });

    if (!checkCategoryExists) {
      const category = categoryRepository.create({
        title,
        provider_id,
      });
      await categoryRepository.save(category);
      return category;
    }

    throw new AppError('Título da categoria já existe');
  }
}

export default CreateCategoryService;
