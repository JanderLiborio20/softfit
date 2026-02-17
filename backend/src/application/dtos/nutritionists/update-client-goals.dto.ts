import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MacrosDto {
  @ApiProperty({ example: 250 })
  @IsNumber()
  @Min(0)
  @Max(1000)
  carbsGrams: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  @Max(500)
  proteinGrams: number;

  @ApiProperty({ example: 60 })
  @IsNumber()
  @Min(0)
  @Max(300)
  fatGrams: number;
}

/**
 * DTO para nutricionista ajustar metas do cliente
 * RF026 - Ajuste de Metas do Cliente
 * RN005 - Hierarquia de Metas
 */
export class UpdateClientGoalsDto {
  @ApiProperty({ example: 2000 })
  @IsNumber()
  @Min(800)
  @Max(5000)
  @IsNotEmpty()
  dailyCaloriesGoal: number;

  @ApiProperty({ type: MacrosDto })
  @ValidateNested()
  @Type(() => MacrosDto)
  @IsNotEmpty()
  dailyMacrosGoal: MacrosDto;
}
