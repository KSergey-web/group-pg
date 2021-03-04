import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { User } from '../utilities/user.decorator';
import { UserEntity } from './entities/user.entity';
import { UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Current User',
    type: UserEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  currentUser(@User() user: UserDocument): UserEntity {
    return { _id: user._id, login: user.login };
  }
}
