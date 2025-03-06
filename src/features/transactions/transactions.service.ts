import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAll() {
    return await this.transactionRepository.find();
  }

  async getTransactionsByDate(accountId: string, year: number) {
    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select([
        `strftime('%m', transaction.createdAt) AS month`, // Extraer mes
        `COUNT(transaction.id) AS transactionsTotal`,
      ])
      .where('transaction.accountId = :accountId', { accountId })
      .andWhere("strftime('%Y', transaction.createdAt) = :year", {
        year: year.toString(),
      }) // Extraer año
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Mapeo de todos los meses del año (1 a 12) asegurando que todos los meses estén representados
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Creamos un objeto con los meses del año y transactionsTotal en 0 por defecto
    const formattedTransactions = months.map((month) => {
      const transaction = transactions.find((t) => Number(t.month) === month);
      return {
        year,
        month,
        transactionsTotal: transaction
          ? Number(transaction.transactionsTotal)
          : 0,
      };
    });

    // Calculamos el total de todas las transacciones en el año
    const total = formattedTransactions.reduce(
      (sum, item) => sum + item.transactionsTotal,
      0,
    );

    // Devolvemos la estructura deseada
    return {
      transactions: formattedTransactions,
      total,
    };
  }

  async getTransactionsByMonth(
    accountId: string,
    year: number,
    month: number,
    page: number,
    limit: number,
  ) {
    // const offset = (page - 1) * limit; // Calcula el desplazamiento para la paginación.

    const [transactions, totalRecords] = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.accountId = :accountId', { accountId })
      .andWhere("strftime('%Y', transaction.createdAt) = :year", {
        year: year.toString(),
      }) // Filtra por año
      .andWhere("strftime('%m', transaction.createdAt) = :month", {
        month: month.toString().padStart(2, '0'),
      }) // Filtra por mes
      .orderBy('transaction.createdAt', 'DESC') // Ordenar por fecha de transacción descendente
      .skip(page)
      .take(limit)
      .getManyAndCount(); // Obtiene los datos paginados y la cantidad total de registros

    return {
      transactions,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    };
  }

  async getTransactionYears(accountId: string): Promise<number[]> {
    const years = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select("DISTINCT strftime('%Y', transaction.createdAt) AS year") // Extraer años únicos
      .where('transaction.accountId = :accountId', { accountId })
      .orderBy('year', 'ASC') // Ordenar de menor a mayor
      .getRawMany();

    // Retornar solo un array de números
    return years.map((t) => Number(t.year));
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }
}
