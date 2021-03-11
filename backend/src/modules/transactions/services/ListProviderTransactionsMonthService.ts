import { injectable, inject } from 'tsyringe';
import { parseISO } from 'date-fns';

import {
  ICategoryDTO,
  IProviderYearDTO,
} from '@modules/transactions/dtos/IListProviderTransactionsMonthServiceDTO';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
export default class ListProviderTransactionsMonthService {
  constructor(
    @inject('TransactionsRepository')
    private ormRepository: ITransactionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ provider, date }: IProviderYearDTO): Promise<unknown> {
    const transactionsRepository = await this.ormRepository.findManyTransactions();
    const categoriesRepository = await this.ormRepository.findManyCategories();

    const parsedDate = parseISO(date);

    const categoriesTitle = categoriesRepository.filter(
      (category: ICategoryDTO) => ({
        id: category.id,
        title: category.title,
      }),
    );

    function getRepositoryBalance() {
      const categoryTotal = transactionsRepository.filter(
        transaction =>
          transaction.date.getMonth() === parsedDate.getMonth() &&
          transaction.date.getFullYear() === parsedDate.getFullYear() &&
          transaction.provider_id === provider,
      );

      const category = categoriesRepository.filter(
        categoryfilter => categoryfilter.id,
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
      const average = total / 12;

      return {
        transaction: categoryTotal,
        category,
        income,
        outcome,
        total,
        average,
      };
    }

    const yearYYYY = parseInt(date, 10);

    const cacheData = await this.cacheProvider.recover(
      `list-transactions-${provider}:${yearYYYY}:${date}-month`,
    );

    let listTransactions = null;

    if (cacheData) {
      listTransactions = cacheData;


    } else {


      const balanceForCategory = transactionsRepository.map(() =>
        getRepositoryBalance(),
      );

      const balanceForCategoryNoDuplicated = Object.values(
        balanceForCategory.reduce(
          (acc, cur) => Object.assign(acc, { [cur.total]: cur }),
          {},
        ),
      );

      listTransactions = balanceForCategoryNoDuplicated;

      await this.cacheProvider.save(
        `list-transactions-${provider}:${yearYYYY}:${date}-month`,
        balanceForCategoryNoDuplicated,
      );
    }

    return listTransactions;
  }
}
