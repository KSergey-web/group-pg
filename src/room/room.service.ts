import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayService } from '../play/play.service';
import { Room, RoomDocument } from './schemas/room.schema';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  private readonly playService: PlayService,
  ) {}

  async createRoom(name: string, userId: string): Promise<RoomDocument> {
    const room = new this.roomModel({ name: name, user: userId });
    await room.save();
    await room.populate('user').execPopulate();
    return room;
  }

  async getRooms(): Promise<Array<RoomDocument>> {
    const rooms = await this.roomModel.find({isDeleted:{$ne:true}}).populate('user').exec();
    return rooms;
  }

  async getRoomById(id: string): Promise<RoomDocument> {
    const room = await this.roomModel.findById(id);
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }
    return room;
  }

  isOwner(room: RoomDocument, userId: string) {
    //consoleOut(`${room} ${userId}`)
    if (room.user.toString() != userId) {
      throw new HttpException(
        'You are not owner this room',
        HttpStatus.BAD_REQUEST,
      );
    }
    return;
  }

  async deleteRoom(roomId: string, userId: string): Promise<string> {
    const room = await this.getRoomById(roomId);
    this.isOwner(room, userId);
    room.set({ isDeleted:true });
    await room.save();
    this.playService.roomDeleted(room.id);
    return `Room ${roomId} deleted`;
  }
}
