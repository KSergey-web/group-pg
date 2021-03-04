import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { configModule } from './configure.root';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { RoomModule } from './room/room.module';
import { NoteModule } from './note/note.module';
import { PlayModule } from './play/play.module';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(process.env.MONGODB_WRITE_CONNECTION_STRING),
    AuthModule,
    SharedModule,
    RoomModule,
    NoteModule,
    PlayModule,
    //SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
