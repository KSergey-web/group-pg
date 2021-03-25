import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { CreateNoteDTO } from '../../note/dto/note.dto';

export class CreateSocketDto {}

export class AuthDto {
  token: string;
}

export class RateDTO extends CreateNoteDTO {
  @ApiProperty({ example: 'sergey' })
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  login: string;
}
