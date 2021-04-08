import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { LoginDTO, RegisterDTO } from '../src/user/dto/user.dto';
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

describe('AUTH', () => {
  const user: RegisterDTO = {
    login: 'username',
    password: 'password',
  };

  const userLogin: LoginDTO = {
    login: 'username',
    password: 'password',
  };
  const userLoginIncorrect: LoginDTO = {
    login: 'username',
    password: 'passw',
  };

  let userToken: string;

  it('should register user', () => {
    return request(app)
      .post('v1/api/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        expect(body.token).toBeDefined();
        expect(body.login).toEqual('username');
      })
      .expect(HttpStatus.CREATED);
  });

  it('call register with incorrect login and password. should return error', () => {
    return request(app)
      .post('v1/api/auth/register')
      .set('Accept', 'application/json')
      .send({login:"", password:""})
      .expect(({ body }) => {
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should reject duplicate registration', () => {
    return request(app)
      .post('v1/api/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
      })
      .expect(HttpStatus.CONFLICT);
  });

  it('should login user', () => {
    return request(app)
      .post('v1/api/auth/login')
      .set('Accept', 'application/json')
      .send(userLogin)
      .expect(({ body }) => {
        userToken = body.token;
        expect(body.token).toBeDefined();
        expect(body.login).toEqual('username');
        expect(body.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED);
  });

  it('login with incorrect password. Should return error', () => {
    return request(app)
      .post('v1/api/auth/login')
      .set('Accept', 'application/json')
      .send(userLoginIncorrect)
      .expect(({ body }) => {
        expect(body.message).toEqual('Invalid credentials');
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('current user', () => {
    return request(app)
      .get('v1/api/user')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
  });
});
