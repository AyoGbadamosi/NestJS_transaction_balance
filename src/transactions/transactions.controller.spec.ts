import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from '../dto/transaction.dto';

describe('TransactionsController (e2e)', () => {
    let app: INestApplication;
    let transactionsService = {
        createTransaction: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [TransactionsController],
            providers: [
                {
                    provide: TransactionsService,
                    useValue: transactionsService,
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/transactions (POST) should create a transaction', () => {
        const dto: CreateTransactionDto = { userId: 'someUserId', amount: 100, type: 'credit' };
        transactionsService.createTransaction.mockResolvedValue({ status: 'completed' });

        return request(app.getHttpServer())
            .post('/transactions')
            .send(dto)
            .expect(201)
            .expect({ status: 'completed' });
    });

    it('/transactions (POST) should return 400 on bad request', () => {
        const dto: CreateTransactionDto = { userId: 'someUserId', amount: -100, type: 'credit' };
        transactionsService.createTransaction.mockRejectedValue(new BadRequestException('Invalid amount'));

        return request(app.getHttpServer())
            .post('/transactions')
            .send(dto)
            .expect(400)
            .expect({
                statusCode: 400,
                message: 'Invalid amount',
                error: 'Bad Request',
            });
    });

    afterAll(async () => {
        await app.close();
    });
});