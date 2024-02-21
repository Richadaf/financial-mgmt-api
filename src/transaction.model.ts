import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true })
  accountId: string;

  @Prop({ required: true })
  type: string; // 'deposit', 'withdrawal', 'transfer'

  @Prop({ required: true })
  amount: number;

  @Prop()
  transferAccountId?: string; // if type is 'transfer'
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
