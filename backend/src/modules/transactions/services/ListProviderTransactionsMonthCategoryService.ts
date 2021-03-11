import { injectable, inject } from 'tsyringe';
import { parseISO } from 'date-fns';

import {
  ICategoryDTO,
  ICategoryProviderYearDTO,
} from '@modules/transactions/dtos/IListProviderTransactionsMonthCategoryServiceDTO';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
export default class ListProviderTransactionsMonthCategoryService {
  constructor(
    @inject('TransactionsRepository')
    private ormRepository: ITransactionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    category_id,
    provider_id,
    date,
  }: ICategoryProviderYearDTO): Promise<unknown> {
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
          transaction.provider_id === provider_id &&
          transaction.category_id === category_id,
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
      `list-transactions-${provider_id}:${yearYYYY}:${date}-${category_id}-monthCategory`,
    );

    let listTransactions = null;

    if (cacheData) {
      listTransactions = cacheData;

      // console.log('Usou cache');
    } else {
      //  console.log('Não usou cache');

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
        `list-transactions-${provider_id}:${yearYYYY}:${date}-${category_id}-monthCategory`,
        balanceForCategoryNoDuplicated,
      );
    }

    return listTransactions;
  }
}
