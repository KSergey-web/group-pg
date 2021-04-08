import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { NoteEntity } from 'src/note/entities/note.entity';
import { CreateRoomDTO } from 'src/room/dto/room.dto';
import { RoomEntity } from 'src/room/entities/room.entity';
import { RegisterDTO } from 'src/user/dto/user.dto';
import * as request from 'supertest';
import {NoteSchema} from '../src/note/schemas/note.schema';
const app = `http://localhost:4000/`;
const database = 'mongodb://localhost:27017/testing';

const user: RegisterDTO = {
    login: 'username',
    password: 'password',
  };

  const room: CreateRoomDTO = {name: "my room"};


  let userToken: string;
  let userId: string;
  let roomEntity: RoomEntity;

  let note;

beforeAll(async () => {
  await mongoose.connect(database,{ useNewUrlParser: true, useUnifiedTopology:true });
  await mongoose.connection.db.dropDatabase();


  await request(app)
      .post('v1/api/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        expect(body.token).toBeDefined();
        expect(body.login).toEqual('username');
        userToken = body.token;
        userId = body._id;
      })
      .expect(HttpStatus.CREATED);

  
    await  request(app)
        .post('v1/api/room')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send(room)
        .expect(({ body }) => {
          expect((<RoomEntity>body)._id).toBeDefined();
          expect((<RoomEntity>body).name).toEqual(room.name);
          expect((<RoomEntity>body).user).toEqual(user.login);
          roomEntity = body;
        })
        .expect(HttpStatus.CREATED);
    
    note={
        _id:'606e238674e0a73fd8d14b2c',
        color:'red',
        user:userId,
        room:roomEntity._id,
        result:'win',
        date: new Date(),
        }
       let model = mongoose.model('Note',NoteSchema,'notes');
       await model.create(note);
});

afterAll(async done => {
  mongoose.disconnect(done);
});

describe('NOTE', () => {
    
      it('should return rooms', () => {
        return request(app)
          .get('v1/api/note/all')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(({ body }) => {
              expect(body[0]._id).toBe(note._id);
          })
          .expect(HttpStatus.OK);
      });
})