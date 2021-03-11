import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderTransactionsMonthCategoryService from '@modules/transactions/services/ListProviderTransactionsMonthCategoryService';

export default class ListProviderMonthCategoryontroller {
  public async index(request: Request, response: Response): Promise<Response> {
    const listTransactions = container.resolve(
      ListProviderTransactionsMonthCategoryService,
    );

    // const { id, provider_id, year } = request.params;

    const { category_id, provider_id, date } = request.query;

    // const provider = provider_id;

    const transactionsBalance = await listTransactions.execute({
      category_id: String(category_id),
      provider_id: String(provider_id),
      date: String(date),
    });

    return response.json({
      transactions: transactionsBalance,
    });
  }
}
