import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: '60b8a3c2e1b5c2a0d4f1c2d2', description: 'User ID for the transaction' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 100, description: 'Amount for the transaction' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'credit', description: 'Transaction type, either debit or credit' })
  @IsNotEmpty()
  @IsIn(['debit', 'credit'])
  type: string;
}
