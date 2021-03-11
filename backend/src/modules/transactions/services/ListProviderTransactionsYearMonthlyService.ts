import { injectable, inject } from 'tsyringe';
import { parseISO } from 'date-fns';

import {
  ICategoryDTO,
  IProviderYearDTO,
} from '@modules/transactions/dtos/IListProviderTransactionsYearMonthlyServiceDTO';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
export default class ListProviderTransactionsYearMonthlyService {
  constructor(
    @inject('TransactionsRepository')
    private ormRepository: ITransactionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ provider, year }: IProviderYearDTO): Promise<unknown> {
    const transactionsRepository = await this.ormRepository.findManyTransactions();
    const categoriesRepository = await this.ormRepository.findManyCategories();

    const categoriesTitle = categoriesRepository.filter(
      (category: ICategoryDTO) => ({
        id: category.id,
        title: category.title,
      }),
    );

    const parsedYear = parseInt(year, 10);

    const months = [
      `${parsedYear}-01-01`,
      `${parsedYear}-02-01`,
      `${parsedYear}-03-01`,
      `${parsedYear}-04-01`,
      `${parsedYear}-05-01`,
      `${parsedYear}-06-01`,
      `${parsedYear}-07-01`,
      `${parsedYear}-08-01`,
      `${parsedYear}-09-01`,
      `${parsedYear}-10-01`,
      `${parsedYear}-11-01`,
      `${parsedYear}-12-01`,
    ];

    function getRepositoryBalance(date: string, provider_id: string) {
      const categoryTotal = transactionsRepository.filter(
        transaction =>
          transaction.date.getMonth() === parseISO(date).getMonth() &&
          transaction.provider_id === provider_id &&
          transaction.date.getFullYear() === parsedYear,
      );

      const income = categoryTotal.reduce((accumulator, current) => {
        if (
          current.type === 'income' &&
          categoriesTitle.filter(
            transaction => transaction.id === current.category_id,
          )
        ) {
          return accumulator + current.value;
        }
        return accumulator;
      }, 0);

      const outcome = categoryTotal.reduce((accumulator, current) => {
        if (
          current.type === 'outcome' &&
          categoriesTitle.filter(
            transaction => transaction.id === current.category_id,
          )
        ) {
          return accumulator + current.value;
        }
        return accumulator;
      }, 0);

      const total = income - outcome;
      const transactionIndex = months.indexOf(date);
      const month = date;

      return {
        income,
        outcome,
        total,
        transaction_index: transactionIndex,
        month,
      };
    }


    const cacheData = await this.cacheProvider.recover(
      `list-transactions-${provider}:${year}:monthly`,
    );

    let listTransactions = null;

    if (cacheData) {
      listTransactions = cacheData;


    } else {


      const balanceForCategory = months.map(map =>
        getRepositoryBalance(map, provider),
      );

      listTransactions = balanceForCategory;

      await this.cacheProvider.save(
        `list-transactions-${provider}:${year}:monthly`,
        balanceForCategory,
      );
    }

    return listTransactions;
  }
}
