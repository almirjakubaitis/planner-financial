import { Router } from 'express';

import CategoriesController from '@modules/categories/infra/http/controllers/CategoriesController';
import ListCategoriesController from '@modules/categories/infra/http/controllers/ListCategoriesController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const categoriesRouter = Router();

const categoriesController = new CategoriesController();
const listCategoriesController = new ListCategoriesController();

categoriesRouter.use(ensureAuthenticated);

categoriesRouter.get('/all', listCategoriesController.index);

categoriesRouter.get('', categoriesController.index);

categoriesRouter.post('/', categoriesController.create);

categoriesRouter.put('/:id/:provider_id', categoriesController.update);

categoriesRouter.delete('/:id/:provider_id', categoriesController.delete);

export default categoriesRouter;
