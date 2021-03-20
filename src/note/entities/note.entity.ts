import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { rateEnum, resultEnum } from 'src/shared/enums/roulette.enum';

export class NoteEntity {
  @ApiProperty({ example: '603fdf6e6271140dc0fcf3cf' })
  _id: string;

  @ApiProperty({ example: 'my room' })
  room: string;

  @ApiProperty({ example: 'sergey' })
  user: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: rateEnum })
  color: string;

  @ApiProperty({ enum: resultEnum })
  result: string;
}
