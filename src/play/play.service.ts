import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { consoleOut } from 'src/debug';
import { AuthService } from '../auth/auth.service';
import { CreateNoteDTO } from '../note/dto/note.dto';
import { NoteService } from '../note/note.service';
import { rateEnum } from '../shared/enums/roulette.enum';
import { UserService } from '../user/user.service';
import { AuthDto, RateDTO } from './dto/play.dto';

@Injectable()
export class PlayService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly noteService: NoteService,
  ) {}

  setServer(server){
    this.server=server;
  }

  server: Server;

  private usersOnline = new Map();
  private roomsOnline = new Map();
  private rates: Map<string, Array<CreateNoteDTO>> = new Map();

  private logger: Logger = new Logger('PlayService');

  async auth(client: Socket, auth: AuthDto) {
    //console.log(this.server);
    const token = auth.token;
    try {
      const user = await this.authService.verifyUser(token);
      this.usersOnline.set(user._id, client.id);
      this.logger.log(`auth ${this.usersOnline.get(user._id)}`);
    } catch (err) {
      this.logger.error(`Invalid token: ${token}`);
      client.emit('errorAuth', {message:`Invalid token`});
    }
    return;
  }

  addUserToRoom(userid: string, room: string) {
    const client = this.getClient(userid);
    if (!client) return;
    client.join(room);
    console.log(client.rooms);
    return;
  }

  deleteUserFromRoom(userid: any, room: any) {
    const client = this.getClient(userid);
    if (!client) return;
    client.leave(room);
    return;
  }

  getClient(userid: any): Socket {
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
    this.logger.warn(`socket ${client.id}} leave ${room}`)
    console.warn(`users in room ${room}`);
    console.log(this.getClientsFromRoom(room));
    return;
  }

  getClientsFromRoom(roomId:string): {} {
    let sockets = this.server.sockets.adapter.rooms[roomId]?.sockets
    if (sockets){
    return sockets;
    }
    else{
      {}
    }
  }

  getRandomColor(): string {
    const number = Math.floor(Math.random() * (3 - 0) + 0);
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
        this.logger.error(`Error random ${number}`);
    }
    return color;
  }

  initTimerForRoom(room: string) {
    let timerId = setInterval(() => {
      const color: string = this.getRandomColor();
      console.log(` col ${color}`);
      this.server.to(room).emit('resultRate', { color });
      let rates = this.rates.get(room);
      if (rates.length == 0) {
        return;
      }
      this.noteService.createManyNotesWithResult(rates, color);
      rates.splice(0, rates.length);
    }, 4000);
    return timerId;
  }

  clientEnterRoom(client: Socket, room: string) {
    if (!this.roomsOnline.has(room)) {
      const timerId = this.initTimerForRoom(room);
      this.roomsOnline.set(room, timerId);
      this.rates.set(room, []);
    }
    client.join(room);
    this.logger.warn(`socket ${client.id} enter to ${room}`)
    console.warn(`users in room ${room}`);
    console.log(this.getClientsFromRoom(room));
    this.synchronization(client,room);
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

  roomDeleted(roomId:string){
    consoleOut(roomId);
    this.server.to(roomId).emit('roomDeleted',{id: roomId});
  }

  synchronization(client: Socket,roomId:string){
    const rates = this.rates.get(roomId);
    rates.forEach(function(rate){
      client.emit('someBodyRate', rate);
    });
  }
}
