import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  Min,
  Max,
  ValidateNested,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para dados de macronutrientes da refeição
 */
class MealMacrosDto {
  @ApiProperty({ example: 50, description: 'Carboidratos em gramas' })
  @IsNumber()
  @Min(0)
  @Max(500)
  carbsGrams: number;

  @ApiProperty({ example: 30, description: 'Proteínas em gramas' })
  @IsNumber()
  @Min(0)
  @Max(300)
  proteinGrams: number;

  @ApiProperty({ example: 15, description: 'Gorduras em gramas' })
  @IsNumber()
  @Min(0)
  @Max(200)
  fatGrams: number;
}

/**
 * DTO para confirmação/edição de refeição após processamento da IA
 * RF012 - Confirmação e Edição de Refeição
 */
export class ConfirmMealDto {
  @ApiProperty({
    example: 'Café da Manhã',
    description: 'Nome/tipo da refeição',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: ['Pão integral', 'Ovo mexido', 'Café com leite'],
    description: 'Lista de alimentos identificados',
  })
  @IsArray()
  @IsString({ each: true })
  foods: string[];

  @ApiProperty({
    example: 450,
    description: 'Total de calorias da refeição',
    minimum: 0,
    maximum: 5000,
  })
  @IsNumber()
  @Min(0)
  @Max(5000)
  calories: number;

  @ApiProperty({
    description: 'Macronutrientes da refeição',
    type: MealMacrosDto,
  })
  @ValidateNested()
  @Type(() => MealMacrosDto)
  macros: MealMacrosDto;

  @ApiProperty({
    example: '2024-01-15T08:30:00Z',
    description: 'Horário da refeição',
    required: false,
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  mealTime?: Date;
}
