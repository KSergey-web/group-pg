import { Logger } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateNoteDTO } from 'src/note/dto/note.dto';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { AuthDto } from './dto/play.dto';
import { PlayService } from './play.service';

@WebSocketGateway()
export class PlayGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly playService: PlayService) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('PlayGateway');

  @SubscribeMessage('auth')
  auth(@MessageBody() dto: AuthDto, @ConnectedSocket() client: Socket) {
    return this.playService.auth(client, dto);
  }

  @ApiOkResponse()
  @SubscribeMessage('Rate')
  handleMessage(
    @MessageBody() dto: CreateNoteDTO,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(dto.rate);
    //this.server.to(dto.chat).emit('msgToClient', message);
  }

  @SubscribeMessage('LeaveRoom')
  exitTeam(@MessageBody() dto: ObjectIdDTO, @ConnectedSocket() client: Socket) {
    this.logger.log(dto.id);
    this.playService.clientLeaveRoom(client, dto.id);
  }

  @SubscribeMessage('EnterRoom')
  enterTeam(
    @MessageBody() dto: ObjectIdDTO,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(dto.id);
    this.playService.clientEnterRoom(client, dto.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.playService.clientDisconnect(client);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
