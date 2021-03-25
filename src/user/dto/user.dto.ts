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

export class LoginDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @IsAlphanumeric()
  @ApiProperty({
    example: 'skulaev',
    description: 'It should contains only letters and numbers, minLength: 2, maxLength: 8,.',
    minLength: 2,
    maxLength: 8,
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  //@Matches(
  // /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
  // { message: 'Password should corresponds to /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/' },
  //)
  @ApiProperty({
    example: 'Kulaev1999',
    description:
      'should be minLength: 4, maxLength: 10,',
    minLength: 4,
    maxLength: 10,
  })
  password: string;
}

export class RegisterDTO extends LoginDTO {}
