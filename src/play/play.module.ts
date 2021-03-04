import { Module } from '@nestjs/common';
import { PlayService } from './play.service';
import { PlayGateway } from './play.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { NoteModule } from 'src/note/note.module';

@Module({
  imports: [AuthModule, UserModule, NoteModule],
  providers: [PlayGateway, PlayService],
})
export class PlayModule {}
