import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderBalanceYearService from '@modules/transactions/services/ListProviderBalanceYearService';
import ListProviderTransactionsYearCategoryService from '@modules/transactions/services/ListProviderTransactionsYearCategoryService';

export default class ListProviderYearCategoryController {
  public async index(request: Request, response: Response): Promise<Response> {
    const transactionsService = container.resolve(
      ListProviderTransactionsYearCategoryService,
    );

    const balanceService = container.resolve(ListProviderBalanceYearService);

    // const { id, provider_id, year } = request.params;
    const { category_id, provider_id, year } = request.query;

    const balance = await balanceService.execute({
      provider: String(provider_id),
      year: Number(year),
    });

    const transactionsBalance = await transactionsService.execute({
      category_id: String(category_id),
      provider_id: String(provider_id),
      year: Number(year),
    });

    return response.json({
      balance,
      transactions: transactionsBalance,
    });
  }
}
