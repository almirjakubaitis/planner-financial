import { injectable, inject } from 'tsyringe';

import {
  IBalanceDTO,
  IProviderYearDTO,
} from '@modules/transactions/dtos/IListProviderBalanceYearServiceDTO';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
export default class ListProviderBalanceYearService {
  constructor(
    @inject('TransactionsRepository')
    private ormRepository: ITransactionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider,
    year,
  }: IProviderYearDTO): Promise<IBalanceDTO> {
    const transactionsRepository = await this.ormRepository.findAll(provider);

    const income = transactionsRepository.reduce((accumulator, current) => {
      if (
        current.type === 'income' &&
        current.date.getFullYear() === parseInt(year, 10) &&
        current.provider_id === provider
      ) {
        return accumulator + current.value;
      }
      return accumulator;
    }, 0);

    const outcome = transactionsRepository.reduce((accumulator, current) => {
      if (
        current.type === 'outcome' &&
        current.date.getFullYear() === parseInt(String(year), 10) &&
        current.provider_id === provider
      ) {
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

    const newyear = parseInt(year, 10);

    const cacheData = await this.cacheProvider.recover(
      `list-transactions-${provider}:${newyear}:${year}:balance`,
    );

    let balanceYearServiceValue = null;

    if (cacheData) {
      balanceYearServiceValue = cacheData;


    } else {
      balanceYearServiceValue = balance;

      await this.cacheProvider.save(
        `list-transactions-${provider}:${newyear}:${year}:balance`,
        balance,
      );
    }

    return balanceYearServiceValue;
  }
}
