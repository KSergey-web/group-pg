import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import {
  Body,
  Param,
} from '@nestjs/common/decorators/http/route-params.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import { CreateRoomDTO } from './dto/room.dto';
import { RoomEntity } from './entities/room.entity';
import { RoomService } from './room.service';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Room created',
    type: RoomEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async room(
    @Body() body: CreateRoomDTO,
    @User() { _id }: UserDocument,
  ): Promise<RoomEntity> {
    const room = await this.roomService.createRoom(body.name, _id);
    return { _id: room._id, name: room.name, user: room.user.login.toString() };
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Array rooms',
    type: [RoomEntity],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async rooms(@User() { _id }: UserDocument): Promise<Array<RoomEntity>> {
    let rooms: Array<RoomEntity> = [];
    (await this.roomService.getRooms()).forEach(function(item, i, arr) {
      rooms.push({ _id: item._id, name: item.name, user: item.user.login });
    });
    return rooms;
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Room was deleted',
  })
  @ApiBadRequestResponse({ description: 'You are not owner this room' })
  @ApiNotFoundResponse({ description: 'Room not found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param() params: ObjectIdDTO,
    @User() { _id }: UserDocument,
  ): Promise<any> {
    return { message: this.roomService.deleteRoom(params.id, _id) };
  }
}
