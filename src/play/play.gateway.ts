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
import { AuthDto, RateDTO } from './dto/play.dto';
import { RateEntity } from './entities/play.entity';
import { PlayService } from './play.service';

@WebSocketGateway()
export class PlayGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly playService: PlayService) {
    setTimeout(() => {this.playService.setServer(this.server)},1000)
  }

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('PlayGateway');

  @SubscribeMessage('auth')
  auth(@MessageBody() dto: AuthDto, @ConnectedSocket() client: Socket) {
    this.playService.setServer(this.server);
    return this.playService.auth(client, dto);
  }

  @ApiOkResponse()
  @SubscribeMessage('rate')
  handleMessage(
    @MessageBody() dto: RateDTO,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(dto.rate);
    this.playService.makeRate(dto);
    const res: RateEntity = {
      login: dto.login,
      rate: dto.rate,
    };
    this.server.to(dto.room).emit('someBodyRate', res);
  }

  @SubscribeMessage('leaveRoom')
  exitTeam(@MessageBody() dto: ObjectIdDTO, @ConnectedSocket() client: Socket) {
    this.logger.log(dto.id);
    this.playService.clientLeaveRoom(client, dto.id);
  }

  @SubscribeMessage('enterRoom')
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

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
