import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type RoomDocument = Room & Document;

@Schema()
export class Room {

  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({ required: false })
  isDeleted?: boolean;

  @Prop({ select: false })
  __v?: Number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
