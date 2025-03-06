import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { Account } from '../account/entities/account.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';
import { HandleDBExceptions } from 'src/common/helpers';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    private readonly paginationService: PaginationService,
  ) {}

  private readonly ctxName = this.constructor.name;

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      await this.customerRepository.save(customer);

      const account = this.accountRepository.create({
        customer,
        balance: 0,
        debt: 0,
      });

      await this.accountRepository.save(account);

      customer.account = account;
      await this.customerRepository.save(customer);

      return customer;
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset, order, sort, term } = paginationDto;

    const where: FindOptionsWhere<Customer> = {};

    if (term) {
      where.name = ILike(`%${term}%`);
    }

    return await this.paginationService.paginate(this.customerRepository, {
      limit,
      offset,
      order,
      sort: sort as keyof Customer,
      where,
      // relations: ['account'],
    });
  }

  async findAllSanitized() {
    const customers = await this.customerRepository.find({
      select: ['name', 'account'],
    });

    return customers.map((customer) => ({
      name: customer.name,
      accountId: customer.account.id,
    }));
  }

  async getCustomerSummary() {
    const customers = await this.customerRepository.find({
      relations: ['account'],
    });

    const totalCustomers = customers.length;
    const totalBalance = customers.reduce(
      (sum, customer) => sum + (customer.account?.balance || 0),
      0,
    );
    const totalDebt = customers.reduce(
      (sum, customer) => sum + (customer.account?.debt || 0),
      0,
    );
    const total = totalBalance - totalDebt;

    return {
      total,
      balance: totalBalance,
      debt: totalDebt,
      customers: totalCustomers,
    };
  }

  async findOne(id: string) {
    return this.customerRepository.findOneBy({ id });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const updatedCustomer = await this.customerRepository.preload({
      id,
      ...updateCustomerDto,
    });

    if (!updatedCustomer)
      throw new BadRequestException('Customer not found or data is invalid');

    return await this.customerRepository.save(updatedCustomer);
  }

  async remove(id: string) {
    const customer = await this.findOne(id);

    if (!customer) throw new BadRequestException('Customer not found');

    await this.customerRepository.softRemove(customer);

    return {
      message: 'Customer removed successfully',
    };
  }
}
