import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCategoryService from '@modules/categories/services/CreateCategoryService';
import UpdateCategoryService from '@modules/categories/services/UpdateCategoryService';
import DeleteCategoryService from '@modules/categories/services/DeleteCategoryService';

import ListCategoryProviderService from '@modules/categories/services/ListCategoryProviderService';

export default class CategoriesController {
  public async index(request: Request, response: Response): Promise<Response> {
    // const { provider_id } = request.params;
    const { provider_id } = request.query;

    const categoriesRepository = container.resolve(ListCategoryProviderService);

    const categories = await categoriesRepository.execute({
      provider_id: String(provider_id),
    });

    return response.json({ categories });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { title, provider_id } = request.body;

    const createCategory = container.resolve(CreateCategoryService);

    const category = await createCategory.execute({
      title,
      provider_id,
    });

    return response.json(category);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, provider_id } = request.params;
    const { title, updated_at } = request.body;

    const updateCategory = container.resolve(UpdateCategoryService);

    await updateCategory.execute({
      id,
      title,
      updated_at,
      provider_id,
    });

    return response.json(title);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id, provider_id } = request.params;

    const deleteCategory = container.resolve(DeleteCategoryService);

    await deleteCategory.execute({ id, provider_id });

    return response.status(204).send();
  }
}
