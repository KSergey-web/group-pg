import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { consoleOut } from 'src/debug';
import { Room } from 'src/room/schemas/room.schema';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { UserDocument } from '../user/schemas/user.schema';
import { User } from '../utilities/user.decorator';
import { NoteEntity } from './entities/note.entity';
import { NoteService } from './note.service';

@ApiTags('note')
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService,
    private readonly userService: UserService
    ) {}
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Array notes',
    type: [NoteEntity],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async notes(@User() { _id }: UserDocument): Promise<Array<NoteEntity>> {
    let notes: Array<NoteEntity> = [];
    let arrayDocuments = await this.noteService.getNotes(_id);
    for (let i =0, host;i<arrayDocuments.length; ++i){
      host = await this.userService.checkUserById((arrayDocuments[i].room as Room).user.toString());
      notes.push({
        _id: arrayDocuments[i]._id,
        color: arrayDocuments[i].color,
        result: arrayDocuments[i].result,
        date: arrayDocuments[i].date,
        user: host.login,
        room: (arrayDocuments[i].room as Room).name,
      });
    }
    return notes;
    }
}
