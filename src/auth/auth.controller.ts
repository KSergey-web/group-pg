import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { promises } from 'dns';
import { UserEntity, UserWithTokenEntity } from 'src/user/entities/user.entity';
import { LoginDTO, RegisterDTO } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.gaurd';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOkResponse({
    description: 'Logged in',
    type: UserWithTokenEntity,
  })
  @ApiUnauthorizedResponse({description: 'Invalid credentials'})
  @Post('login')
  async login(@Body() userDTO: LoginDTO): Promise<UserWithTokenEntity> {
    const user = await this.userService.findByLogin(userDTO);
    const payload = {
      login: user.login,
    };
    const token = await this.authService.login(payload);
    return { _id: user._id, login: user.login ,token: token };
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'You registered and logged in',
    type: UserWithTokenEntity,
  })
  @ApiBadRequestResponse({ description: 'User already exists.'})
  async register(@Body() userDTO: RegisterDTO):  Promise<UserWithTokenEntity> {
    const user = await this.userService.create(userDTO);
    const payload = {
      login: user.login,
    };
    const token = await this.authService.login(payload);
    return { _id: user._id, login: user.login ,token: token };
  }
}
