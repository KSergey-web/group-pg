import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/play.dto';

@Injectable()
export class PlayService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer() server: Server;

  private usersOnline = new Map();

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

  clientLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    return;
  }

  clientEnterRoom(client: Socket, room: string) {
    client.join(room);
    return;
  }

  clientDisconnect(client: Socket) {
    client.leaveAll();
    for (var [userId, socketId] of this.usersOnline) {
      if (socketId == client.id) {
        this.usersOnline.delete(userId);
        break;
      }
    }
    return;
  }
}
