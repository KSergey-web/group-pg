import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDTO } from './dto/note.dto';
import { Note, NoteDocument } from './schemas/note.schema';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async createNote(dto: CreateNoteDTO): Promise<NoteDocument> {
    const note = new this.noteModel(dto);
    await note.save();
    note.populate('user');
    return note;
  }

  async getNotes(): Promise<Array<NoteDocument>> {
    const notes = await this.noteModel
      .find()
      .populate('user', 'login')
      .populate('room', 'name');
    return notes;
  }
}
