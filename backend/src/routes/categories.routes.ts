import { Router } from 'express';
import { getManager } from 'typeorm';

import CategoryModel from '../models/Category';

import CreateCategoryService from '../services/CreateCategoryService';
import UpdateCategoryService from '../services/UpdateCategoryService';
import DeleteCategoryService from '../services/DeleteCategoryService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const categoriesRouter = Router();

categoriesRouter.use(ensureAuthenticated);

categoriesRouter.get('/', async (request, response) => {
  const categoriesRepository = getManager();

  const categories = await categoriesRepository.find(CategoryModel, {
    order: { title: 'ASC' },
  });

  return response.json({ categories });
});

categoriesRouter.get('/:provider_id', async (request, response) => {
  const { provider_id } = request.params;
  const categoriesRepository = getManager();

  const categories = await categoriesRepository.find(CategoryModel, {
    order: { title: 'ASC' },
  });

  const filteredCategories = categories.filter(
    map => map.provider_id === provider_id,
  );

  return response.json({ categories: filteredCategories });
});

categoriesRouter.post('/', async (request, response) => {
  const { title, provider_id } = request.body;

  const createCategory = new CreateCategoryService();

  const category = await createCategory.execute({
    title,
    provider_id,
  });

  return response.json(category);
});

categoriesRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { title, updated_at } = request.body;

  const updateCategory = new UpdateCategoryService();

  await updateCategory.execute({
    id,
    title,
    updated_at,
  });

  return response.json(title);
});

categoriesRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteCategory = new DeleteCategoryService();

  await deleteCategory.execute({ id });

  return response.status(204).send();
});

export default categoriesRouter;
