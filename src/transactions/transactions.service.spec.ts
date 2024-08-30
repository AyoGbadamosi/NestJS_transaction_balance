import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Transaction } from './schemas/transacton.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { status } from './enums/enum';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let userModel: any;
  let transactionModel: any;

  beforeEach(async () => {
    userModel = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    transactionModel = {
      create: jest.fn().mockReturnThis(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Transaction.name), useValue: transactionModel },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should throw NotFoundException if user is not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(
        service.createTransaction({ userId: 'someUserId', amount: 100, type: 'debit' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return failed status with error if user has insufficient balance for debit', async () => {
      userModel.findById.mockResolvedValue({ walletBalance: 50 });

      const result = await service.createTransaction({ userId: 'someUserId', amount: 100, type: 'debit' });

      expect(result).toEqual({
        status: 'failed',
        error: 'Insufficient balance',
      });
    });

    it('should debit the user and save the transaction', async () => {
      const user = { walletBalance: 150, save: jest.fn() };
      userModel.findById.mockResolvedValue(user);

      const dto = { userId: 'someUserId', amount: 100, type: 'debit' };

      await service.createTransaction(dto);

      expect(user.walletBalance).toBe(50);
      expect(user.save).toHaveBeenCalled();
      expect(transactionModel.create).toHaveBeenCalledWith({
        amount: 100,
        type: 'debit',
        status: status.COMPLETED,
        userId: 'someUserId',
      });
      expect(transactionModel.save).toHaveBeenCalled();
    });

    it('should credit the user and save the transaction', async () => {
      const user = { walletBalance: 150, save: jest.fn() };
      userModel.findById.mockResolvedValue(user);

      const dto = { userId: 'someUserId', amount: 100, type: 'credit' };

      await service.createTransaction(dto);

      expect(user.walletBalance).toBe(250);
      expect(user.save).toHaveBeenCalled();
      expect(transactionModel.create).toHaveBeenCalledWith({
        amount: 100,
        type: 'credit',
        status: status.COMPLETED,
        userId: 'someUserId',
      });
      expect(transactionModel.save).toHaveBeenCalled();
    });
  });
});