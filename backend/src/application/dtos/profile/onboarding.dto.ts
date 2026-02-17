import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, UserGoal, ActivityLevel } from '@domain/enums';

/**
 * DTO para dados de onboarding do cliente
 * RF005 - Onboarding Inicial
 */
export class OnboardingDto {
  @ApiProperty({
    example: '1990-05-15',
    description: 'Data de nascimento',
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    example: 'male',
    description: 'Gênero do usuário',
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    example: 175,
    description: 'Altura em centímetros (100-250)',
    minimum: 100,
    maximum: 250,
  })
  @IsNumber()
  @Min(100)
  @Max(250)
  @IsNotEmpty()
  heightCm: number;

  @ApiProperty({
    example: 75.5,
    description: 'Peso em quilogramas (30-300)',
    minimum: 30,
    maximum: 300,
  })
  @IsNumber()
  @Min(30)
  @Max(300)
  @IsNotEmpty()
  weightKg: number;

  @ApiProperty({
    example: 'lose_weight',
    description: 'Objetivo principal do usuário',
    enum: UserGoal,
  })
  @IsEnum(UserGoal)
  @IsNotEmpty()
  goal: UserGoal;

  @ApiProperty({
    example: 'moderately_active',
    description: 'Nível de atividade física',
    enum: ActivityLevel,
  })
  @IsEnum(ActivityLevel)
  @IsNotEmpty()
  activityLevel: ActivityLevel;
}
