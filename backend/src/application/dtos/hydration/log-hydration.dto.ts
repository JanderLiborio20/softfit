import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DrinkType } from '@domain/enums';

/**
 * DTO para registrar consumo de líquido
 */
export class LogHydrationDto {
  @ApiProperty({
    example: 250,
    description: 'Volume em mililitros',
    minimum: 1,
    maximum: 5000,
  })
  @IsNumber()
  @Min(1)
  @Max(5000)
  @IsNotEmpty()
  volumeMl: number;

  @ApiProperty({
    example: 'water',
    description: 'Tipo de bebida',
    enum: DrinkType,
  })
  @IsEnum(DrinkType)
  @IsNotEmpty()
  drinkType: DrinkType;

  @ApiProperty({
    example: '2024-01-15T08:30:00Z',
    description: 'Horário do consumo',
    required: false,
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  timestamp?: Date;
}
