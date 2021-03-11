import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderTransactionsMonthService from '@modules/transactions/services/ListProviderTransactionsMonthService';

export default class ListProviderMonthController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderTransactionsService = container.resolve(
      ListProviderTransactionsMonthService,
    );

    // const { provider_id, year } = request.params;

    const { provider_id, date } = request.query;

    // const provider = provider_id;

    const transactionsBalance = await listProviderTransactionsService.execute({
      provider: String(provider_id),
      date: String(date),
    });

    return response.json({
      transactions: transactionsBalance,
    });
  }
}
