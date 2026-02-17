import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { WorkoutType } from '@domain/enums';

/**
 * DTO para criação de ficha de treino
 * RF018 - Criação de Ficha de Treino
 */
export class CreateWorkoutDto {
  @ApiProperty({ example: 'Treino A - Peito e Tríceps' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'ABC', enum: WorkoutType })
  @IsEnum(WorkoutType)
  @IsNotEmpty()
  type: WorkoutType;

  @ApiProperty({ example: 'Foco em hipertrofia', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
