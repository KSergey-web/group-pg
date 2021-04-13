import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { CreateRoomDTO } from 'src/room/dto/room.dto';
import { RoomEntity } from 'src/room/entities/room.entity';
import { RegisterDTO } from 'src/user/dto/user.dto';
import * as request from 'supertest';

const app = `http://localhost:4000/`;
const database = 'mongodb://localhost:27017/testing';

beforeAll(async () => {
  await mongoose.connect(database,{ useNewUrlParser: true, useUnifiedTopology:true });
  await mongoose.connection.db.dropDatabase();
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('ROOM', () => {
    const user: RegisterDTO = {
      login: 'username',
      password: 'password',
    };

    const room: CreateRoomDTO = {name: "my room"};
  
  
    let userToken: string;
    let userId: string;
    let roomEntity: RoomEntity;
  
    it('should register user', () => {
      return request(app)
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
    });

    it('should create room', () => {
        return request(app)
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
      });

      it('should return rooms', () => {
        return request(app)
          .get('v1/api/room/all')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(({ body }) => {
              expect(body).toContainEqual(roomEntity);
          })
          .expect(HttpStatus.OK);
      });

      const user2: RegisterDTO = {
        login: 'username2',
        password: 'password',
      };
  
    
    
      let userToken2: string;
      let userId2: string;

      it('should register second user', () => {
        return request(app)
          .post('v1/api/auth/register')
          .set('Accept', 'application/json')
          .send(user2)
          .expect(({ body }) => {
            expect(body._id).toBeDefined();
            expect(body.token).toBeDefined();
            expect(body.login).toEqual('username2');
            userToken2 = body.token;
            userId2 = body._id;
          })
          .expect(HttpStatus.CREATED);
      });

      it('should error delete', () => {
        return request(app)
          .delete(`v1/api/room/${roomEntity._id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${userToken2}`)
          .expect(({ body }) => {
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      
      it('should delete', () => {
        return request(app)
          .delete(`v1/api/room/${roomEntity._id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(({ body }) => {
            expect(body.message).toEqual(`Room ${roomEntity._id} deleted`);
          })
          .expect(HttpStatus.OK);
      });

      it('should return error', () => {
        return request(app)
          .delete(`v1/api/room/32`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(({ body }) => {
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

})