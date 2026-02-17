import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para uma refeição planejada
 */
export class PlannedMealDto {
  @ApiProperty({ example: 'Café da Manhã' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({ example: ['Pão integral', 'Ovo mexido', 'Café com leite'] })
  @IsArray()
  @IsString({ each: true })
  foods: string[];

  @ApiProperty({ example: ['2 fatias', '2 unidades', '200ml'] })
  @IsArray()
  @IsString({ each: true })
  portions: string[];

  @ApiProperty({ example: 'Evitar adicionar açúcar', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  observations?: string;
}

/**
 * DTO para criação de plano alimentar
 * RF024 - Criação de Plano Alimentar
 */
export class CreateNutritionPlanDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ example: 'Plano para Emagrecimento - Janeiro 2024' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Plano focado em déficit calórico controlado', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ type: [PlannedMealDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlannedMealDto)
  plannedMeals: PlannedMealDto[];

  @ApiProperty({ example: 'Beber 2L de água por dia', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  generalGuidelines?: string;

  @ApiProperty({ example: 30, description: 'Duração em dias', required: false })
  @IsNumber()
  @Min(1)
  @Max(365)
  @IsOptional()
  durationDays?: number;

  @ApiProperty({ example: '2024-01-15', required: false, type: String })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;
}
