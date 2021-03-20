import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { rateEnum, resultEnum } from 'src/shared/enums/roulette.enum';

export class RateEntity {
  @ApiProperty({ example: 'red, green, black' })
  color: string;

  @ApiProperty({ example: 'sergey' })
  login: string;
}
