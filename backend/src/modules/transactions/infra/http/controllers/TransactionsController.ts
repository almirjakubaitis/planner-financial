import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

import CreateTransactionService from '@modules/transactions/services/CreateTransactionService';
import DeleteTransactionService from '@modules/transactions/services/DeleteTransactionService';
import UpdateTransactionService from '@modules/transactions/services/UpdateTransactionService';

export default class TransactionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      provider_id,
      date,
      copies,
      type,
      value,
      category,
      title,
      description,
    } = request.body;

    const parsedDate = parseISO(date);

    const createTransaction = container.resolve(CreateTransactionService);


    const transaction = await createTransaction.execute({
      provider_id,
      date: parsedDate,
      copies,
      type,
      value,
      category,
      title,
      description,
    });

    return response.json(transaction);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id, provider_id } = request.params;

    const deleteTransaction = container.resolve(DeleteTransactionService);

    await deleteTransaction.execute({
      id,
      provider_id,
    });

    return response.status(204).send();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const {
      provider_id,
      date,
      copies,
      type,
      value,
      category,
      title,
      description,
      updated_at,
    } = request.body;

    const parsedDate = parseISO(date);

    const updateTransaction = container.resolve(UpdateTransactionService);

    await updateTransaction.execute({
      id,
      provider_id,
      date: parsedDate,
      copies,
      type,
      value,
      category,
      title,
      description,
      updated_at,
    });

    return response.json({
      id,
      provider_id,
      date: parsedDate,
      copies,
      type,
      value,
      category,
      title,
      description,
      updated_at,
    });
  }
}
