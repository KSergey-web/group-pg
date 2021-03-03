import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
import { LoginDTO, RegisterDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { consoleOut } from '../debug';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userDTO: RegisterDTO) {
    const { login } = userDTO;
    const user = await this.userModel.findOne({ login });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(userDTO);
    await createdUser.save();
    return createdUser;
  }

  async findByLogin(userDTO: LoginDTO) {
    const { login, password } = userDTO;
    const user = await this.userModel.findOne({ login });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (await bcrypt.compare(password, user.password)) {
      return user;
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async findByPayload(payload: any) {
    //используется для получения пользователя в JWTStrategy
    const { login } = payload;
    return await this.userModel.findOne({ login });
  }

  // TODO this method is for development only, remove later
  async findAll() {
    return await this.userModel.find().exec();
  }


  async checkUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
