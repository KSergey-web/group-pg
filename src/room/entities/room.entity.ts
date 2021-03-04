import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class RoomEntity {
  @ApiProperty({ example: '603fdf6e6271140dc0fcf3cf' })
  _id: string;

  @ApiProperty({ example: 'my room' })
  name: string;

  @ApiProperty({ example: 'sergey' })
  user: string;
}
