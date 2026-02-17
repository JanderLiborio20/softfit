import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  Min,
  Max,
  ValidateNested,
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
 * DTO para atualização de refeição existente
 * RF015 - Edição de Refeição Registrada
 */
export class UpdateMealDto {
  @ApiProperty({
    example: 'Café da Manhã',
    description: 'Nome/tipo da refeição',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: ['Pão integral', 'Ovo mexido', 'Café com leite'],
    description: 'Lista de alimentos',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  foods?: string[];

  @ApiProperty({
    example: 450,
    description: 'Total de calorias da refeição',
    minimum: 0,
    maximum: 5000,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(5000)
  @IsOptional()
  calories?: number;

  @ApiProperty({
    description: 'Macronutrientes da refeição',
    type: MealMacrosDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => MealMacrosDto)
  @IsOptional()
  macros?: MealMacrosDto;
}
