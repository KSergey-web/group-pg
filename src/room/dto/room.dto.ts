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
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

export class CreateRoomDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @ApiProperty({
    example: 'my room',
    description: 'name of room',
    minLength: 2,
    maxLength: 15,
  })
  name: string;
}
