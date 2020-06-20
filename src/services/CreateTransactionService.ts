import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
}
class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category_id,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('value unavaiable', 400);
    }
    let category = await categoryRepository.findOne({
      where: { title: category_id },
    });
    if (!category) {
      category = categoryRepository.create({
        title: category_id,
      });
      await categoryRepository.save(category);
    }
    const transactions = transactionsRepository.create({
      title,
      type,
      value,
      category,
    });
    await transactionsRepository.save(transactions);
    return transactions;
  }
}

export default CreateTransactionService;
