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
    example: 's_kulaev',
    description: 'It should contains only letters and numbers.',
    minLength: 2,
    maxLength: 14,
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  // @Matches(
  // /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
  // { message: 'Weak password' },
  //)
  @ApiProperty({
    example: 'Kulaev1999',
    description:
      'should corresponds to /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/',
    minLength: 2,
    maxLength: 14,
  })
  password: string;
}

export class RegisterDTO extends LoginDTO {}
