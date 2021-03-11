import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderBalanceYearService from '@modules/transactions/services/ListProviderBalanceYearService';
import ListProviderTransactionsYearMonthlyService from '@modules/transactions/services/ListProviderTransactionsYearMonthlyService';

export default class ListProviderYearMonthlyController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderTransactionsService = container.resolve(
      ListProviderTransactionsYearMonthlyService,
    );

    const listProviderBalanceService = container.resolve(
      ListProviderBalanceYearService,
    );


    const { provider_id, year } = request.query;

    const provider = provider_id;

    const balance = await listProviderBalanceService.execute({
      provider: String(provider),
      year: Number(year),
    });

    const transactionsBalance = await listProviderTransactionsService.execute({
      provider: String(provider),
      year: Number(year),
    });

    return response.json({
      balance,
      transactions: transactionsBalance,
    });
  }
}
