import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ListProviderController from '@modules/transactions/infra/http/controllers/ListProviderController';
import ListProviderYearController from '@modules/transactions/infra/http/controllers/ListProviderYearController';
import ListProviderYearMonthlyController from '@modules/transactions/infra/http/controllers/ListProviderYearMonthlyController';
import ListProviderMonthController from '@modules/transactions/infra/http/controllers/ListProviderMonthController';
import ListProviderMonthCategoryController from '@modules/transactions/infra/http/controllers/ListProviderMonthCategoryController';

import ListProviderYearCategoryController from '@modules/transactions/infra/http/controllers/ListProviderYearCategoryController';

import TransactionsController from '@modules/transactions/infra/http/controllers/TransactionsController';

const transactionsRouter = Router();
const listProviderController = new ListProviderController();
const listProviderYearController = new ListProviderYearController();
const listProviderYearMonthlyController = new ListProviderYearMonthlyController();

const listProviderMonthController = new ListProviderMonthController();
const listProviderMonthCategoryController = new ListProviderMonthCategoryController();

const listProviderYearCategoryController = new ListProviderYearCategoryController();

const transactionsController = new TransactionsController();

transactionsRouter.use(ensureAuthenticated);

// rota provider

transactionsRouter.get('/provider', listProviderController.index);

// rota provider & year

transactionsRouter.get('', listProviderYearController.index);

// rota meses & provider & year

transactionsRouter.get('/monthly', listProviderYearMonthlyController.index);

// rota um unico mes & year & provider

transactionsRouter.get('/months', listProviderMonthController.index);

// rota de um unico mes & categoria & provider

transactionsRouter.get(
  '/months_category',
  listProviderMonthCategoryController.index,
);

// rota de uma categoria & ano & provider

transactionsRouter.get('/categories', listProviderYearCategoryController.index);

// transactions create, delete, update

transactionsRouter.post('/', transactionsController.create);

transactionsRouter.delete('/:id/:provider_id', transactionsController.delete);

transactionsRouter.put('/:id', transactionsController.update);

export default transactionsRouter;
