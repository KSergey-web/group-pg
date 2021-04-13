import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import faker, { date } from 'faker';
import { Model } from 'mongoose';
import { CreateNoteDTO } from './dto/note.dto';
import { NoteService } from './note.service';
import { Note, NoteDocument} from './schemas/note.schema';
import * as mongoose from 'mongoose';
import { rateEnum, resultEnum } from '../shared/enums/roulette.enum';

describe('NoteService', () => {
  let service: NoteService;
  let noteModel: Model<NoteDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoteService,
        {
          provide: getModelToken(Note.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
    noteModel = module.get(getModelToken(Note.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('creating a note', () => {
  //   it('should save note', async () => {
  //     let userid = mongoose.Types.ObjectId().toString();
  //     let roomid = mongoose.Types.ObjectId().toString();
  //     const toCreated = {
  //         user: userid,
  //         color: rateEnum.black,
  //         room: roomid,
  //         result: resultEnum.win,
  //     };
  
  //     const toReturned = {
  //       _id: '5ee49c3115a4e75254bb732e',
  //       ...toCreated,
  //     };
  
  //     jest.spyOn(noteModel, 'create').mockImplementation(() => Promise.resolve({
  //       ...toReturned,
  //       populate: jest.fn(),
  //     } as any
  //       ));
  
  //     const data = await service.createNote(toCreated);
  //     expect(data._id).toBe('5ee49c3115a4e75254bb732e');
  //     expect(noteModel.create).toBeCalledWith(expect.objectContaining({
  //       ...toCreated, 
  //       date: expect.any(Date)
  //     }));
  //     expect(noteModel.create).toBeCalledTimes(1);
  //   });
  // });
});
