import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  type: string; // either 'debit' or 'credit'

  @Prop({ default: 'pending' })
  status: string; // 'pending', 'completed', 'failed'

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
