import { Module } from '@nestjs/common';
import { PlayService } from './play.service';
import { PlayGateway } from './play.gateway';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { NoteModule } from '../note/note.module';

@Module({
  imports: [AuthModule, UserModule, NoteModule],
  providers: [PlayGateway, PlayService],
  exports:[PlayService]
})
export class PlayModule {}
