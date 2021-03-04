import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { CreateNoteDTO } from 'src/note/dto/note.dto';
import { NoteService } from 'src/note/note.service';
import { rateEnum } from 'src/shared/enums/roulette.enum';
import { UserService } from 'src/user/user.service';
import { AuthDto, RateDTO } from './dto/play.dto';

@Injectable()
export class PlayService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly noteService: NoteService,
  ) {}

  @WebSocketServer() server: Server;

  private usersOnline = new Map();
  private roomsOnline = new Map();
  private rates: Map<string, Array<CreateNoteDTO>> = new Map();

  private logger: Logger = new Logger('PlatService');

  async auth(client: Socket, auth: AuthDto) {
    const token = auth.token;
    try {
      const user = await this.authService.verifyUser(token);
      this.usersOnline.set(user._id, client.id);
      this.logger.log(`auth ${this.usersOnline.get(user._id)}`);
    } catch (err) {
      this.logger.error(`Invalid token: ${token}`);
    }
    return;
  }

  addUserToRoom(userid: string, room: string) {
    const client = this.getClient(userid);
    if (!client) return;
    client.join(room);
    return;
  }

  deleteUserFromRoom(userid: any, room: any) {
    const client = this.getClient(userid);
    if (!client) return;
    client.leave(room);
    return;
  }

  getClient(userid: any) {
    if (!this.usersOnline.has(userid)) {
      this.logger.log(`user with id ${userid} offline`);
      return null;
    }
    return this.server.sockets.connected[this.usersOnline.get(userid)];
  }

  makeRate(dto: RateDTO) {
    this.rates.get(dto.room).push(dto);
  }

  clientLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    this.checkOnlineInRoom(room);
    return;
  }

  getRandomColor(): string {
    const number = Math.random() * (3 - 0) + 0;
    let color: string;
    switch (number) {
      case 0:
        color = rateEnum.black;
        break;
      case 1:
        color = rateEnum.red;
        break;
      case 2:
        color = rateEnum.green;
        break;
      default:
        this.logger.error('Error random');
    }
    return color;
  }

  initTimerForRoom(room: string) {
    let timerId = setInterval(() => {
      const color: string = this.getRandomColor();
      this.server.to(room).emit('resultRate', { color });
      let rates = this.rates.get(room);
      if (rates.length == 0) {
        return;
      }
      this.noteService.createManyNotesWithResult(rates, color);
      rates.splice(0, rates.length);
    }, 60000);
    return timerId;
  }

  clientEnterRoom(client: Socket, room: string) {
    if (!this.roomsOnline.has(room)) {
      const timerId = this.initTimerForRoom(room);
      this.roomsOnline.set(room, timerId);
      this.rates.set(room, []);
    }
    client.join(room);
    return;
  }

  userToOffline(client: Socket) {
    for (var [userId, socketId] of this.usersOnline) {
      if (socketId == client.id) {
        this.usersOnline.delete(userId);
        break;
      }
    }
  }

  checkOnlineInRoom(roomId: string) {
    this.logger.log(`check rooms[0] ${roomId}`);
    const clients = this.server.sockets.adapter.rooms[roomId];
    if (!clients) {
      let timerId = this.roomsOnline.get(roomId);
      clearInterval(timerId);
      this.roomsOnline.delete(roomId);
      this.rates.delete(roomId);
    }
    return;
  }

  clientDisconnect(client: Socket) {
    this.userToOffline(client);
    if (Object.keys(client.rooms).length == 0) {
      return;
    }
    const roomId = Object.keys(client.rooms)[0];
    client.leaveAll();
    this.checkOnlineInRoom(roomId);
  }
}
