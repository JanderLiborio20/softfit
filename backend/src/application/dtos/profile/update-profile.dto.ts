import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, UserGoal, ActivityLevel } from '@domain/enums';

/**
 * DTO para atualização de perfil do cliente
 * RF007 - Edição de Perfil
 */
export class UpdateProfileDto {
  @ApiProperty({
    example: '1990-05-15',
    description: 'Data de nascimento',
    type: String,
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({
    example: 'male',
    description: 'Gênero do usuário',
    enum: Gender,
    required: false,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    example: 175,
    description: 'Altura em centímetros (100-250)',
    minimum: 100,
    maximum: 250,
    required: false,
  })
  @IsNumber()
  @Min(100)
  @Max(250)
  @IsOptional()
  heightCm?: number;

  @ApiProperty({
    example: 75.5,
    description: 'Peso em quilogramas (30-300)',
    minimum: 30,
    maximum: 300,
    required: false,
  })
  @IsNumber()
  @Min(30)
  @Max(300)
  @IsOptional()
  weightKg?: number;

  @ApiProperty({
    example: 'lose_weight',
    description: 'Objetivo principal do usuário',
    enum: UserGoal,
    required: false,
  })
  @IsEnum(UserGoal)
  @IsOptional()
  goal?: UserGoal;

  @ApiProperty({
    example: 'moderately_active',
    description: 'Nível de atividade física',
    enum: ActivityLevel,
    required: false,
  })
  @IsEnum(ActivityLevel)
  @IsOptional()
  activityLevel?: ActivityLevel;
}
