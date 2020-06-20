import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction || Category)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);
    const transactions = await transactionsRepository.find();
    const { income, outcome } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value;
            break;
          case 'outcome':
            accumulator.outcome += transaction.value;
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const total = income - outcome;
    const balance = {
      income,
      outcome,
      total,
    };
    return balance;
  }

  public async findAll(): Promise<any> {
    const transactionsRepository = getRepository(Transaction);
    const transactions = await transactionsRepository.find();
    const categoryRepository = getRepository(Category);
    const transactionsTotal = transactions.map(async transaction => {
      const categorys = await categoryRepository.findOne({
        where: { category_id: transaction.category_id },
      });
      const transactions1 = {
        id: transaction.id,
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: categorys,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at,
      };

      return transactions;
    });

    return transactions;
  }
}

export default TransactionsRepository;
