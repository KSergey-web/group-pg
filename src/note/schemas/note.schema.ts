import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Room } from 'src/room/schemas/room.schema';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop({ required: true, default: new Date() })
  date: Date;

  @Prop({ required: true })
  rate: string;

  @Prop({ default: '' })
  result: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  })
  room: Room;

  @Prop({ select: false })
  __v: Number;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
