import { ApiProperty } from '@nestjs/swagger';
import { Gender, UserGoal, ActivityLevel } from '@domain/enums';

/**
 * DTO de resposta com dados do perfil do cliente
 */
export class ProfileResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: '1990-05-15' })
  dateOfBirth: Date;

  @ApiProperty({ example: 32 })
  age: number;

  @ApiProperty({ example: 'male', enum: Gender })
  gender: Gender;

  @ApiProperty({ example: 175 })
  heightCm: number;

  @ApiProperty({ example: 75.5 })
  weightKg: number;

  @ApiProperty({ example: 24.7, description: 'Índice de Massa Corporal (IMC)' })
  bmi: number;

  @ApiProperty({ example: 'lose_weight', enum: UserGoal })
  goal: UserGoal;

  @ApiProperty({ example: 'moderately_active', enum: ActivityLevel })
  activityLevel: ActivityLevel;

  @ApiProperty({ example: 2000 })
  dailyCaloriesGoal: number;

  @ApiProperty({
    example: {
      carbsGrams: 250,
      proteinGrams: 150,
      fatGrams: 60,
    },
  })
  dailyMacrosGoal: {
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
  };

  @ApiProperty({ example: false })
  isGoalManuallySet: boolean;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  updatedAt: Date;
}
