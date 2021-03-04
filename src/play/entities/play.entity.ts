import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { rateEnum, resultEnum } from 'src/shared/enums/role-user.enum';

export class RateEntity {
  @ApiProperty({ example: 'red, green, black' })
  rate: string;

  @ApiProperty({ example: 'sergey' })
  user: string;
}
