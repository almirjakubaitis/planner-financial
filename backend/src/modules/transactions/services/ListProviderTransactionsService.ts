import { injectable, inject } from 'tsyringe';

import {
  ITransactionDTO,
  ICategoryDTO,
  IProviderDTO,
} from '@modules/transactions/dtos/IListProviderTransactionsServiceDTO';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';

@injectable()
export default class ListProviderTransactionsService {
  constructor(
    @inject('TransactionsRepository')
    private ormRepository: ITransactionsRepository,
  ) {}

  public async execute({ provider }: IProviderDTO): Promise<unknown> {
    const transactionsRepository = await this.ormRepository.findManyTransactions();
    const categoriesRepository = await this.ormRepository.findManyCategories();

    const categoriesTitle = categoriesRepository.filter(
      (category: ICategoryDTO) => ({
        id: category.id,
        title: category.title,
      }),
    );

    function getRepositoryBalance(transactionRepo: ITransactionDTO) {
      const categoryTotal = transactionsRepository.filter(
        transaction =>
          transaction.category_id === transactionRepo.category_id &&
          transaction.provider_id === provider,
      );

      const category = categoriesRepository.filter(
        categoryfilter =>
          categoryfilter.id === transactionRepo.category_id &&
          transactionRepo.provider_id === provider,
      );

      const income = categoryTotal.reduce((accumulator, current) => {
        if (
          current.type === 'income' &&
          categoriesTitle.filter(
            transaction =>
              transaction.id === current.category_id &&
              transactionRepo.provider_id === provider,
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
            transaction =>
              transaction.id === current.category_id &&
              transactionRepo.provider_id === provider,
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
        total,
        average,
      };
    }

    const balanceForCategory = transactionsRepository.map(transactionRepo =>
      getRepositoryBalance(transactionRepo),
    );

    const balanceForCategoryNoDuplicated = Array.from(
      new Set(balanceForCategory.map(JSON.stringify as any)),
    )
      .map(JSON.parse as any)
      .filter((el: any) => {
        return el.transaction.length >= 1;
      });

    return balanceForCategoryNoDuplicated;
  }
}
