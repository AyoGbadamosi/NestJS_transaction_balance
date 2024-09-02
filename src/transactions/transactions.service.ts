import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { CreateTransactionDto } from '../dto/transaction.dto';
import { Transaction } from './schemas/transacton.schema';
import { status } from './enums/enum';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>) { }

  async createTransaction(dto: CreateTransactionDto): Promise<any> {
    const { userId, amount, type } = dto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      if (type === 'debit') {
        if (user.walletBalance < amount) {
          throw new BadRequestException('Insufficient balance');
        }
        user.walletBalance -= amount;
        await user.save();

      } else if (type === 'credit') {
        user.walletBalance += amount;
        await user.save();
      }
      const data = {
        amount: dto.amount,
        type: dto.type,
        status: status.COMPLETED,
        userId: dto.userId
      }
      const transaction = await this.transactionModel.create(data);
      await transaction.save();
      return { status: status.COMPLETED, user };
    } catch (error) {
      return { status: status.FAILED, error: error.message };
    }
  }
}