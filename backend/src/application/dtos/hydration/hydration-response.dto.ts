import { ApiProperty } from '@nestjs/swagger';
import { DrinkType } from '@domain/enums';

/**
 * DTO de resposta com dados de um registro de hidratação
 */
export class HydrationResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: 250 })
  volumeMl: number;

  @ApiProperty({ example: 'water', enum: DrinkType })
  drinkType: DrinkType;

  @ApiProperty({ example: '💧' })
  drinkIcon: string;

  @ApiProperty({ example: '2024-01-15T08:30:00Z' })
  timestamp: Date;

  @ApiProperty({ example: '2024-01-15T08:30:00Z' })
  createdAt: Date;
}

/**
 * DTO de resposta para lista diária de hidratação
 */
export class HydrationDailyResponseDto {
  @ApiProperty({ type: [HydrationResponseDto] })
  entries: HydrationResponseDto[];

  @ApiProperty({ example: 5 })
  total: number;

  @ApiProperty({ example: 1750 })
  totalVolumeMl: number;

  @ApiProperty({ example: 2000 })
  dailyGoalMl: number;

  @ApiProperty({ example: 87.5 })
  progressPercent: number;
}
