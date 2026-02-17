import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { MuscleGroup } from '@domain/enums';

/**
 * DTO para adicionar exercício à ficha de treino
 * RF019 - Adição de Exercícios
 */
export class AddExerciseDto {
  @ApiProperty({ example: 'Supino reto com barra' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'chest', enum: MuscleGroup })
  @IsEnum(MuscleGroup)
  @IsNotEmpty()
  muscleGroup: MuscleGroup;

  @ApiProperty({ example: 4, description: 'Número de séries (1-20)' })
  @IsNumber()
  @Min(1)
  @Max(20)
  sets: number;

  @ApiProperty({ example: '8-12', description: 'Repetições por série' })
  @IsString()
  @IsNotEmpty()
  reps: string;

  @ApiProperty({ example: 90, description: 'Descanso em segundos', required: false })
  @IsNumber()
  @Min(0)
  @Max(600)
  @IsOptional()
  restSeconds?: number;

  @ApiProperty({ example: 'Executar com controle', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  notes?: string;

  @ApiProperty({ example: 0, description: 'Ordem do exercício na ficha' })
  @IsNumber()
  @Min(0)
  order: number;
}
