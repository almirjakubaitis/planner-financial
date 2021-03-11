import { injectable, inject } from 'tsyringe';

import {
  ICategoryDTO,
  ICategoryProviderYearDTO,
} from '@modules/transactions/dtos/IListProviderTransactionsYearCategoryServiceDTO';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
export default class ListProviderTransactionsYearCategoryService {
  constructor(
    @inject('TransactionsRepository')
    private ormRepository: ITransactionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    category_id,
    provider_id,
    year,
  }: ICategoryProviderYearDTO): Promise<unknown> {
    const transactionsRepository = await this.ormRepository.findAllOrderTitleAndDate(
      provider_id,
    );
    const categoriesRepository = await this.ormRepository.findManyCategories();

    const categoriesTitle = categoriesRepository.filter(
      (category: ICategoryDTO) => ({
        id: category.id,
        title: category.title,
      }),
    );

    function getRepositoryBalance() {
      const categoryTotal = transactionsRepository.filter(
        transaction =>
          transaction.category_id === category_id &&
          transaction.provider_id === provider_id &&
          transaction.date.getFullYear() === parseInt(String(year), 10),
      );

      const category = categoriesRepository.filter(
        categoryfilter => categoryfilter.id === category_id,
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
        categoryTitle: category[0].title,
        income,
        outcome,
        total,
        average,
      };
    }

    const cacheData = await this.cacheProvider.recover(
      `list-transactions-${provider_id}:${year}:serviceCategory-${category_id}`,
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
        `list-transactions-${provider_id}:${year}:serviceCategory-${category_id}`,
        balanceForCategoryNoDuplicated,
      );
    }

    return listTransactions;
  }
}
