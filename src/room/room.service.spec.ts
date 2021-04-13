import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { PlayService } from '../play/play.service';
import { RoomService } from './room.service';
import { Room, RoomDocument } from './schemas/room.schema';
import * as jj from '@golevelup/ts-jest';

describe('RoomService', () => {
  let roomService: RoomService;
  let playService: PlayService;
  let roomModel: Model<RoomDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService,
        {
          provide: getModelToken(Room.name),
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
          }
        },
       { 
        provide: PlayService,
        useValue: {
          new: jest.fn(),
        }
      }
    ],
    }).compile();
    roomModel = module.get(getModelToken(Room.name));
    roomService = module.get<RoomService>(RoomService);
    playService = module.get<PlayService>(PlayService);
  });

  it('should be defined', () => {
    expect(roomService).toBeDefined();
    expect(playService).toBeDefined();
    expect(roomModel).toBeDefined();
  });
});
