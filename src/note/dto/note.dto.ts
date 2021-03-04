import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
  IsDate,
  MinLength,
  MaxLength,
  IsAlphanumeric,
  IsMongoId,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { rateEnum, resultEnum } from 'src/shared/enums/roulette.enum';

export class CreateNoteDTO {
  @ApiProperty()
  @IsEnum(rateEnum)
  rate: string;

  @ApiProperty()
  @IsMongoId()
  user: string;

  @ApiProperty()
  @IsMongoId()
  room: string;

  @ApiPropertyOptional()
  @IsEnum(resultEnum)
  result: string;
}
