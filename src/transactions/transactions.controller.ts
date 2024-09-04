import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
  Param,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from '../dto/transaction.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: any,
  ) {
    const userID = req.user.userId;
    createTransactionDto.userId = userID;
    return await this.transactionsService.createTransaction(
      createTransactionDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':Id')
  @ApiOperation({ summary: 'Update transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateTransaction(
    @Param('Id') Id: string,
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: any,
  ) {
    const userID = req.user.userId;
    createTransactionDto.userId = userID;
    return await this.transactionsService.updateTransaction(
      userID,
      Id,
      createTransactionDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:userId')
  async getUserTransactions(@Param('userId') userId: string) {
    return this.transactionsService.getTransactionsByUserId(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:transactionId')
  async deleteTransaction(
    @Req() req: any,
    @Param('transactionId') transactionId: string,
  ) {
    const userId = req.user.userId;
    return this.transactionsService.deleteTransaction(userId, transactionId);
  }
}
