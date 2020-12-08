import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import UpdateTransactionService from '../services/UpdateTransactionService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const transactionsRouter = Router();

transactionsRouter.use(ensureAuthenticated);

transactionsRouter.get('/provider/:provider', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const { provider } = request.params;

  const balance = await transactionsRepository.getBalanceProvider({ provider });

  const transactionsBalance = await transactionsRepository.getTransactionsProvider(
    { provider },
  );

  return response.json({
    balance,
    transactions: transactionsBalance,
  });
});

transactionsRouter.get(
  '/provider/:provider/year/:year',
  async (request, response) => {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { provider, year } = request.params;

    const balance = await transactionsRepository.getBalanceYear({
      year,
      provider,
    });

    const transactionsBalance = await transactionsRepository.getTransactionsProviderYear(
      { provider, year },
    );

    return response.json({
      balance,
      transactions: transactionsBalance,
    });
  },
);

transactionsRouter.get(
  '/monthly/:provider/:year',
  async (request, response) => {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { provider, year } = request.params;

    const balance = await transactionsRepository.getBalanceYear({
      year,
      provider,
    });

    const BalanceMonth = await transactionsRepository.getMonthly({
      provider,
      year,
    });

    return response.json({
      balance,
      transactions: BalanceMonth,
    });
  },
);

transactionsRouter.get('/months/:year/:provider', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const { year, provider } = request.params;

  const balance = await transactionsRepository.getBalanceProvider({
    provider,
  });

  const categoriesBalanceMonth = await transactionsRepository.getBalanceMonths({
    year,
    provider,
  });

  return response.json({
    balance,
    transactions: categoriesBalanceMonth,
  });
});

transactionsRouter.get(
  '/months/:year/categories/:id/:provider',
  async (request, response) => {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { id, year, provider } = request.params;

    const balance = await transactionsRepository.getBalanceProvider({
      provider,
    });

    const categoriesBalanceMonth = await transactionsRepository.getCategoriesBalanceMonthly(
      {
        id,
        year,
        provider,
      },
    );

    return response.json({
      balance,
      transactions: categoriesBalanceMonth,
    });
  },
);

transactionsRouter.get(
  '/categories/:id/:provider/:year',
  async (request, response) => {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { id, provider, year } = request.params;

    const balance = await transactionsRepository.getBalanceProvider({
      provider,
    });

    const categoriesBalance = await transactionsRepository.getCategoriesBalanceYear(
      {
        id,
        provider,
        year,
      },
    );

    return response.json({
      balance,
      transactions: categoriesBalance,
    });
  },
);

transactionsRouter.post('/', async (request, response) => {
  const {
    provider_id,
    date,
    copies,
    type,
    value,
    category,
    title,
    description,
  } = request.body;

  const parsedDate = parseISO(date);

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    provider_id,
    date: parsedDate,
    copies,
    type,
    value,
    category,
    title,
    description,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({
    id,
  });

  return response.status(204).send();
});

transactionsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  const {
    provider_id,
    date,
    copies,
    type,
    value,
    category,
    title,
    description,
    updated_at,
  } = request.body;

  const parsedDate = parseISO(date);

  const updateTransaction = new UpdateTransactionService();

  await updateTransaction.execute({
    id,
    provider_id,
    date: parsedDate,
    copies,
    type,
    value,
    category,
    title,
    description,
    updated_at,
  });

  return response.json({
    id,
    provider_id,
    date: parsedDate,
    copies,
    type,
    value,
    category,
    title,
    description,
    updated_at,
  });
});

export default transactionsRouter;
