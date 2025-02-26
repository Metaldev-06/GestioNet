import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { BalanceDto } from './dto/balance.dto';
import { TransactionType } from 'src/common/enums/transaction-type.enum,';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  private readonly ctxName = this.constructor.name;

  async addBalance(balanceDto: BalanceDto) {
    const { accountId, amount, description } = balanceDto;

    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('Account not found');

    account.balance += amount;
    await this.accountRepository.save(account);

    // Registrar la transacción
    const transaction = this.transactionRepository.create({
      accountId: account,
      amount,
      type: TransactionType.CREDIT,
      description: description ?? 'Saldo agregado',
    });
    await this.transactionRepository.save(transaction);

    return account;
  }

  // AccountService
  async reduceBalance(balanceDto: BalanceDto) {
    const { accountId, amount, description } = balanceDto;

    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('Account not found');

    if (account.balance >= amount) {
      account.balance -= amount;
    } else {
      // Permitir deuda si el saldo es insuficiente
      const remaining = amount - account.balance;
      account.balance = 0;
      account.debt += remaining;
    }

    await this.accountRepository.save(account);

    // Registrar la transacción
    const transaction = this.transactionRepository.create({
      accountId: account,
      amount: -amount,
      type: TransactionType.DEBIT,
      description: description ?? 'Consumo de combustible',
    });
    await this.transactionRepository.save(transaction);

    return account;
  }

  async settleDebt(balanceDto: BalanceDto) {
    const { accountId, amount, description } = balanceDto;

    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('Account not found');

    if (amount >= account.debt) {
      const remaining = amount - account.debt;
      account.debt = 0;
      account.balance += remaining; // Exceso de pago se suma al saldo.
    } else {
      account.debt -= amount; // Reducir solo parte de la deuda.
    }

    await this.accountRepository.save(account);

    // Registrar la transacción
    const transaction = this.transactionRepository.create({
      accountId: account,
      amount: amount,
      type: TransactionType.CREDIT,
      description: description ?? 'Pago de deuda',
    });
    await this.transactionRepository.save(transaction);

    return account;
  }

  async updateDebtLimit(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountRepository.preload({
      id,
      ...updateAccountDto,
    });

    return await this.accountRepository.save(account);
  }
}
