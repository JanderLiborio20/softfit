import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para dados de macronutrientes
 */
class MacrosDto {
  @ApiProperty({ example: 250, description: 'Carboidratos em gramas' })
  @IsNumber()
  @Min(0)
  @Max(1000)
  carbsGrams: number;

  @ApiProperty({ example: 150, description: 'Proteínas em gramas' })
  @IsNumber()
  @Min(0)
  @Max(500)
  proteinGrams: number;

  @ApiProperty({ example: 60, description: 'Gorduras em gramas' })
  @IsNumber()
  @Min(0)
  @Max(300)
  fatGrams: number;
}

/**
 * DTO para atualização manual de metas nutricionais
 * RF008 - Edição Manual de Metas
 */
export class UpdateGoalsDto {
  @ApiProperty({
    example: 2000,
    description: 'Meta diária de calorias (800-5000)',
    minimum: 800,
    maximum: 5000,
  })
  @IsNumber()
  @Min(800)
  @Max(5000)
  @IsNotEmpty()
  dailyCaloriesGoal: number;

  @ApiProperty({
    description: 'Metas diárias de macronutrientes',
    type: MacrosDto,
  })
  @ValidateNested()
  @Type(() => MacrosDto)
  @IsNotEmpty()
  dailyMacrosGoal: MacrosDto;
}
