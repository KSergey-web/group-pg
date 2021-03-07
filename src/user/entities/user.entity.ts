import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty({ example: '603fdf6e6271140dc0fcf3cf' })
  _id: string;

  @ApiProperty({ example: 'skulaev' })
  login: string;
}

export class UserWithTokenEntity extends UserEntity {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InN0cmluZyIsImlhdCI6MTYxNDgwNTMwMCwiZXhwIjoxNjE0ODA4OTAwfQ.f4S7ta5LyN8EQgBp4FcqUmHa3fr2wcG8uHkFJc97g0E',
  })
  token: string;
}
