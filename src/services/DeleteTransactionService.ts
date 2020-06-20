import { getCustomRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transaction = getCustomRepository(TransactionRepository);
    const transactionExists = await transaction.findOne(id);
    if (!transactionExists) {
      throw new AppError('transaction does not exists.');
    }
    await transaction.remove(transactionExists);
  }
}

export default DeleteTransactionService;
