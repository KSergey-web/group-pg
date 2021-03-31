import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { resultEnum } from '../shared/enums/roulette.enum';
import { CreateNoteDTO } from './dto/note.dto';
import { Note, NoteDocument } from './schemas/note.schema';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async createNote(dto: CreateNoteDTO): Promise<NoteDocument> {
    console.log(dto);
    const note = new this.noteModel({...dto, date: new Date()});
    await note.save();
    note.populate('user');
    return note;
  }

  async createManyNotesWithResult(
    arratDto: Array<CreateNoteDTO>,
    color: string,
  ) {
    arratDto.forEach(async (item, i, arr) => {
      if (item.color == color) {
        item.result = resultEnum.win;
      } else {
        item.result = resultEnum.loose;
      }
      this.createNote(item);
    });
  }

  async getNotes(userId: string): Promise<Array<NoteDocument>> {
    const filter: any = {
      user: userId,
    };
    const notes = await this.noteModel
      .find(filter).sort({ date: -1 })
      .populate('user', 'login')
      .populate('room', 'name').exec();
    return notes;
  }
}
