import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { HandleDBExceptions } from 'src/common/helpers';
import { Account } from '../account/entities/account.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination/pagination.service';

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
      await this.customerRepository.save(customer); // Guarda primero el cliente

      const account = this.accountRepository.create({
        customer,
        balance: 0,
        debt: 0,
      });

      await this.accountRepository.save(account); // Guarda la cuenta

      customer.account = account;
      await this.customerRepository.save(customer);

      return customer;
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset, order, sort, term } = paginationDto;

    return await this.paginationService.paginate(this.customerRepository, {
      limit,
      offset,
      order,
      sort: sort as keyof Customer,
      // where: { systemUserId: { id: systemUser.id } },
      // relations: ['account'],
    });
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
