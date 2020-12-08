import { EntityRepository, Repository, getRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import Transaction from '../models/Transaction';
import CategoryModel from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CategoryDTO {
  id: string;
  title: string;
}

interface Category {
  id: string;
  provider: string;
}

interface CategoryYear {
  id: string;
  provider: string;
  year: string;
}

interface CategoryMonthly {
  id: string;
  year: string;
  provider: string;
}

interface Month {
  year: string;
  provider: string;
}

interface Provider {
  provider: string;
}

interface ProviderDate {
  provider: string;
  year: string;
}

interface TransactionDTO {
  provider_id: string;
  date: Date;
  copies: number;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
  category: CategoryDTO;
  title: string;
  description?: string;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalanceProvider({ provider }: Provider): Promise<Balance> {
    const transactionsRepository = await this.find();

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

  public async getBalanceYear({
    year,
    provider,
  }: ProviderDate): Promise<unknown> {
    const transactionsRepository = await this.find();

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
        current.date.getFullYear() === parseInt(year, 10) &&
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

    return balance;
  }

  public async getCategories(): Promise<CategoryModel[]> {
    const categoryRepository = getRepository(CategoryModel);

    const categories = await categoryRepository.createQueryBuilder().getMany();

    return categories;
  }

  public async getTransactionsProvider({
    provider,
  }: Provider): Promise<unknown> {
    const categoryRepository = getRepository(CategoryModel);
    const transactionRepository = getRepository(Transaction);

    const categoriesRepository = await categoryRepository
      .createQueryBuilder()
      .getMany();
    const transactionsRepository = await transactionRepository
      .createQueryBuilder()
      .getMany();

    const categoriesTitle = categoriesRepository.filter(
      (category: CategoryDTO) => ({
        id: category.id,
        title: category.title,
      }),
    );

    function getRepositoryBalance(transactionRepo: TransactionDTO) {
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

  public async getTransactionsProviderYear({
    provider,
    year,
  }: ProviderDate): Promise<unknown> {
    const categoryRepository = getRepository(CategoryModel);
    const transactionRepository = getRepository(Transaction);

    const categoriesRepository = await categoryRepository
      .createQueryBuilder()
      .getMany();
    const transactionsRepository = await transactionRepository.find();

    const categoriesTitle = categoriesRepository.filter(
      (category: CategoryDTO) => ({
        id: category.id,
        title: category.title,
      }),
    );

    const parsedYear = parseInt(year, 10);

    function getRepositoryBalance(transactionRepo: TransactionDTO) {
      const categoryTotal = transactionsRepository.filter(
        transaction =>
          transaction.category_id === transactionRepo.category_id &&
          transaction.provider_id === provider &&
          transaction.date.getFullYear() === parsedYear,
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

  public async getTransactions(): Promise<unknown> {
    const categoryRepository = getRepository(CategoryModel);
    const transactionRepository = getRepository(Transaction);

    const categoriesRepository = await categoryRepository
      .createQueryBuilder()
      .getMany();
    const transactionsRepository = await transactionRepository
      .createQueryBuilder()
      .getMany();

    const categoriesTitle = categoriesRepository.filter(
      (category: CategoryDTO) => ({
        id: category.id,
        title: category.title,
      }),
    );

    function getRepositoryBalance(transactionRepo: TransactionDTO) {
      const categoryTotal = transactionsRepository.filter(
        transaction =>
          transaction.category_id === transactionRepo.category_id &&
          transaction.provider_id === 'd801f84d-1a33-460f-a82f-c624ec5b43ae',
      );

      const category = categoriesRepository.filter(
        categoryfilter => categoryfilter.id === transactionRepo.category_id,
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
        total,
        average,
      };
    }

    const balanceForCategory = transactionsRepository.map(transactionRepo =>
      getRepositoryBalance(transactionRepo),
    );

    const balanceForCategoryNoDuplicated = Object.values(
      balanceForCategory.reduce(
        (acc, cur) => Object.assign(acc, { [cur.total]: cur }),
        {},
      ),
    );

    return balanceForCategoryNoDuplicated;
  }

  public async getBalanceMonths({ year, provider }: Month): Promise<unknown> {
    const categoryRepository = getRepository(CategoryModel);
    const transactionRepository = getRepository(Transaction);

    const date = year;

    const parsedDate = parseISO(date);

    const categoriesRepository = await categoryRepository
      .createQueryBuilder()
      .getMany();
    const transactionsRepository = await transactionRepository
      .createQueryBuilder()
      .getMany();

    const categoriesTitle = categoriesRepository.filter(
      (category: CategoryDTO) => ({
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

    const balanceForCategory = transactionsRepository.map(() =>
      getRepositoryBalance(),
    );

    // FUNCIONA TAMBÉM PARA REMOÇÃO MAS FICA COM ERRO NO TYPESCRIPT
    // const balanceForCategoryNoDuplicated = Array.from(
    //   new Set(balanceForCategory.map(JSON.stringify)),
    // ).map(JSON.parse);

    const balanceForCategoryNoDuplicated = Object.values(
      balanceForCategory.reduce(
        (acc, cur) => Object.assign(acc, { [cur.total]: cur }),
        {},
      ),
    );

    return balanceForCategoryNoDuplicated;
  }

  public async getCategoriesBalanceYear({
    id,
    provider,
    year,
  }: CategoryYear): Promise<unknown> {
    const categoryRepository = getRepository(CategoryModel);
    const transactionRepository = getRepository(Transaction);

    const categoriesRepository = await categoryRepository
      .createQueryBuilder()
      .getMany();

    const transactionsRepository = await transactionRepository.find({
      order: { title: 'ASC', date: 'ASC' },
    });

    const categoriesTitle = categoriesRepository.filter(
      (category: CategoryDTO) => ({
        id: category.id,
        title: category.title,
      }),
    );

    function getRepositoryBalance() {
      const categoryTotal = transactionsRepository.filter(
        transaction =>
          transaction.category_id === id &&
          transaction.provider_id === provider &&
          transaction.date.getFullYear() === parseInt(year, 10),
      );

      const category = categoriesRepository.filter(
        categoryfilter => categoryfilter.id === id,
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

    const balanceForCategory = transactionsRepository.map(() =>
      getRepositoryBalance(),
    );

    const balanceForCategoryNoDuplicated = Object.values(
      balanceForCategory.reduce(
        (acc, cur) => Object.assign(acc, { [cur.total]: cur }),
        {},
      ),
    );

    return balanceForCategoryNoDuplicated;
  }

  public async getCategoriesBalanceMonthly({
    id,
    year,
    provider,
  }: CategoryMonthly): Promise<unknown> {
    const categoryRepository = getRepository(CategoryModel);
    const transactionRepository = getRepository(Transaction);

    const date = year;
    const parsedDate = parseISO(date);

    const categoriesRepository = await categoryRepository
      .createQueryBuilder()
      .getMany();
    const transactionsRepository = await transactionRepository
      .createQueryBuilder()
      .getMany();

    const categoriesTitle = categoriesRepository.filter(
      (category: CategoryDTO) => ({
        id: category.id,
        title: category.title,
      }),
    );

    function getRepositoryBalance() {
      const categoryTotal = transactionsRepository.filter(
        transaction =>
          transaction.category_id === id &&
          transaction.date.getMonth() === parsedDate.getMonth() &&
          transaction.date.getFullYear() === parsedDate.getFullYear() &&
          transaction.provider_id === provider,
      );

      const category = categoriesRepository.filter(
        categoryfilter => categoryfilter.id === id,
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

    const balanceForCategory = transactionsRepository.map(() =>
      getRepositoryBalance(),
    );

    const balanceForCategoryNoDuplicated = Object.values(
      balanceForCategory.reduce(
        (acc, cur) => Object.assign(acc, { [cur.total]: cur }),
        {},
      ),
    );

    return balanceForCategoryNoDuplicated;
  }

  public async getMonthly({ provider, year }: ProviderDate): Promise<unknown> {
    const categoryRepository = getRepository(CategoryModel);
    const transactionRepository = getRepository(Transaction);

    const parsedYear = parseInt(year, 10);

    const categoriesRepository = await categoryRepository
      .createQueryBuilder()
      .getMany();
    const transactionsRepository = await transactionRepository
      .createQueryBuilder()
      .getMany();

    const categoriesTitle = categoriesRepository.filter(
      (category: CategoryDTO) => ({
        id: category.id,
        title: category.title,
      }),
    );

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
    // const parsedDate = parseISO(date);

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

    const balanceForCategory = months.map(map =>
      getRepositoryBalance(map, provider),
    );

    return balanceForCategory;
  }
}

export default TransactionsRepository;
