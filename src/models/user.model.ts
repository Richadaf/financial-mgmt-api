/**
 * @file This file defines the User model, its schema and methods.
 * @module user.model
 * @requires {@link https://www.npmjs.com/package/@nestjs/mongoose @nestjs/mongoose}
 * @requires {@link https://www.npmjs.com/package/mongoose mongoose}
 * @requires {@link https://www.npmjs.com/package/bcryptjs bcryptjs}
 * @requires ../enums/userRoles.enum
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRoles } from '../enums/userRoles.enum';
export type UserDocument = User & Document;
export type UserDocumentWithFunc = UserDocument & {
  strip?(): StrippedUser;
  transform?(): TransformedUser;
};

export interface StrippedUser {
  role?: string;
  tokens?: { token: string }[];
  username: string;
}
export interface TransformedUser {
  role?: string;
  tokens?: { token: string }[];
  username?: string;
  user?: TransformedUser;
  token?: string;
}
@Schema()
export class User {
  //Just for testing p. _id is mongoose default prop for id
  _id?: string;
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRoles, default: UserRoles.USER })
  role: string;

  @Prop({ type: [{ token: String, _id: String }] })
  tokens: { token: string; _id?: string }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
UserSchema.pre<UserDocument>('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    //TODO:If user not verified, send verification email.
  } catch (presaveError: any) {
    return next(presaveError);
  }
});
UserSchema.methods.transform = function (): TransformedUser {
  const transformed = {};
  const fields = [
    'username',
    'role',
    'tokens',
    'other',
    'fields',
    'to',
    'expose',
  ];

  fields.forEach((field) => {
    transformed[field] = this[field];
  });
  return transformed as TransformedUser;
};
UserSchema.methods.strip = function (): StrippedUser {
  const stripped = {};
  const fields = ['username'];

  fields.forEach((field) => {
    stripped[field] = this[field];
  });
  return stripped as StrippedUser;
};
