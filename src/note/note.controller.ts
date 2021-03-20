import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import { NoteEntity } from './entities/note.entity';
import { NoteService } from './note.service';

@ApiTags('note')
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Array notes',
    type: [NoteEntity],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async notes(@User() { _id }: UserDocument): Promise<Array<NoteEntity>> {
    let notes: Array<NoteEntity> = [];
    (await this.noteService.getNotes(_id)).forEach(function(item, i, arr) {
      notes.push({
        _id: item._id,
        color: item.color,
        result: item.result,
        date: item.date,
        user: item.user.login.toString(),
        room: item.room.name.toString(),
      });
    });
    return notes;
  }
}
