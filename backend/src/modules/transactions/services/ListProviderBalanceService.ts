import { injectable, inject } from 'tsyringe';

import {
  IBalanceDTO,
  IProviderDTO,
} from '@modules/transactions/dtos/IListProviderBalanceServiceDTO';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';

@injectable()
export default class ListProviderBalanceService {
  constructor(
    @inject('TransactionsRepository')
    private ormRepository: ITransactionsRepository,
  ) {}

  public async execute({ provider }: IProviderDTO): Promise<IBalanceDTO> {
    const transactionsRepository = await this.ormRepository.findAll(provider);

    const income = transactionsRepository.reduce((accumulator, current) => {
      if (current.type === 'income' && current.provider_id === provider) {
        return accumulator + current.value;
      }
      return accumulator;
    }, 0);

    const outcome = transactionsRepository.reduce((accumulator, current) => {
      if (current.type === 'outcome' && current.provider_id === provider) {
        return accumulator + current.value;
      }
      return accumulator;
    }, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}
