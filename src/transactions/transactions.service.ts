import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
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

  async updateTransaction(
    userId: string,
    transactionId: string,
    updateTransactionDto: CreateTransactionDto
  ): Promise<any> {
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (userId != transaction.userId) {
      throw new UnauthorizedException('You are not authorized to update this transaction');
    }
    const user = await this.userModel.findById(userId);
    try {
      if (updateTransactionDto.type) {
        if (updateTransactionDto.type === 'debit' && transaction.type !== 'debit') {
          if (transaction.amount > user.walletBalance) {
            throw new BadRequestException('Insufficient balance for debit');
          }
          user.walletBalance -= transaction.amount;
        } else if (updateTransactionDto.type === 'credit' && transaction.type !== 'credit') {
          user.walletBalance += transaction.amount;
        }
      }
      Object.assign(transaction, updateTransactionDto);
      await user.save();
      await transaction.save();

      return { status: status.COMPLETED, transaction };
    } catch (error) {
      return { status: status.FAILED, error: error.message };
    }
  }

  async getTransactionsByUserId(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const transactions = await this.transactionModel.find({ userId }).exec();
    if (!transactions || transactions.length === 0) {
      throw new NotFoundException('No transactions found for this user');
    }

    return transactions;
  }

  async deleteTransaction(userId: string, transactionId: string): Promise<any> {
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.userId.toString() !== userId) {
      throw new BadRequestException('User ID does not match the transaction owner');
    }
    await this.transactionModel.deleteOne({ _id: transactionId });
    return { status: status.COMPLETED, message: 'Transaction deleted successfully' };
  }

}