import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderBalanceService from '@modules/transactions/services/ListProviderBalanceService';
import ListProviderTransactionsService from '@modules/transactions/services/ListProviderTransactionsService';

export default class ListProviderController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderTransactionsService = container.resolve(
      ListProviderTransactionsService,
    );

    const listProviderBalanceService = container.resolve(
      ListProviderBalanceService,
    );

    const { provider_id } = request.query;

    const balance = await listProviderBalanceService.execute({
      provider: String(provider_id),
    });

    const transactionsBalance = await listProviderTransactionsService.execute({
      provider: String(provider_id),
    });

    return response.json({
      balance,
      transactions: transactionsBalance,
    });
  }
}
