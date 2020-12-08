import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
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
    }
  }
}

export default DeleteTransactionService;
