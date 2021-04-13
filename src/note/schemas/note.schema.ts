import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Room } from '../../room/schemas/room.schema';

export type NoteDocument = Note & Document;

@Schema()
export class Note {

  _id?: string;

  @Prop({ required: true})
  date: Date;

  @Prop({ required: true })
  color: string;

  @Prop({ default: '' })
  result: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  })
  room: Room | string;

  @Prop({ select: false })
  __v: Number;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
