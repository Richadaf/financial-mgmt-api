/**
 * @fileoverview This module defines the Account schema.
 * @module account.model
 * @requires {@link https://www.npmjs.com/package/@nestjs/mongoose @nestjs/mongoose}
 * @requires {@link https://www.npmjs.com/package/mongoose mongoose}
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
/**
 * @typedef {Object} AccountDocument
 * @extends Document
 * @property {string} userId - The user ID associated with the account.
 * @property {number} balance - The balance of the account.
 */
export type AccountDocument = Account & Document;
/**
 * @class
 * @classdesc This class represents an Account in the system.
 */
@Schema()
export class Account {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Number, required: true })
  balance: number;
}
/**
 * @constant
 * @type {mongoose.Schema}
 * @description The schema created from the Account class.
 */
export const AccountSchema = SchemaFactory.createForClass(Account);
