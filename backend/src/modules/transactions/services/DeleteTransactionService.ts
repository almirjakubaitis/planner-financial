import { getRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';
import { injectable, inject } from 'tsyringe';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  id: string;
  provider_id: string;
}

@injectable()
export default class DeleteTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository, // categoryRepository: ICategoriesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ id, provider_id }: IRequest): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const checkTransactionExists = await transactionsRepository.findOne({
      where: { id },
    });

    if (!checkTransactionExists) {
      throw new AppError('Transaction not found', 400);
    } else {
      await transactionsRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute();

      const year = checkTransactionExists.date.getFullYear();

      await this.cacheProvider.invalidatePrefix(
        `list-transactions-${provider_id}:${year}`,
      );
    }
  }
}
