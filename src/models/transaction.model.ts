/**
 * @fileoverview This module defines the Transaction schema and related functionality.
 * @module transaction.model
 * @requires {@link https://www.npmjs.com/package/@nestjs/mongoose @nestjs/mongoose}
 * @requires {@link https://www.npmjs.com/package/mongoose mongoose}
 * @requires ../enums/transactionTypes.enum}
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TransactionTypes } from '../enums/transactionTypes.enum';
/**
 * @typedef {Object} TransactionDocument
 * @extends Document
 * @property {mongoose.Schema.Types.ObjectId} accountId - The account ID associated with the transaction.
 * @property {string} type - The type of the transaction.
 * @property {number} amount - The amount involved in the transaction.
 * @property {string} [transferAccountId] - The account ID for transfer transactions.
 */
export type TransactionDocument = Transaction & Document;
/**
 * @class
 * @classdesc This class represents a Transaction in the system.
 */
@Schema()
export class Transaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  })
  accountId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true, enum: TransactionTypes })
  type: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String })
  transferAccountId?: string;
}
/**
 * @constant
 * @type {mongoose.Schema}
 * @description The schema created from the Transaction class.
 */
export const TransactionSchema = SchemaFactory.createForClass(Transaction);

//TODO: Add a TransactionSchema.pre('save', async function (next) {})
// that checks if the type is transfer. if so, make sure id
//is compulsory. Also, an on update that blocks type from changing.

//To make queries atomic, I'll use the $set in Mongoose.
