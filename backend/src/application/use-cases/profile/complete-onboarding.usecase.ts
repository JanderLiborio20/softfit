import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ClientProfile } from '@domain/entities';
import { Gender } from '@domain/enums';
import { ACTIVITY_LEVEL_MULTIPLIER } from '@domain/enums/activity-level.enum';
import { GOAL_CALORIE_ADJUSTMENT } from '@domain/enums/user-goal.enum';
import { Macros } from '@domain/value-objects';
import {
  IClientProfileRepository,
  CLIENT_PROFILE_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { OnboardingDto, ProfileResponseDto } from '@application/dtos/profile';

@Injectable()
export class CompleteOnboardingUseCase {
  constructor(
    @Inject(CLIENT_PROFILE_REPOSITORY_TOKEN)
    private readonly profileRepository: IClientProfileRepository,
  ) {}

  async execute(userId: string, dto: OnboardingDto): Promise<ProfileResponseDto> {
    const existing = await this.profileRepository.findByUserId(userId);
    if (existing) {
      throw new ConflictException('Onboarding já foi completado');
    }

    const dateOfBirth = new Date(dto.dateOfBirth);
    const age = this.calculateAge(dateOfBirth);

    // Harris-Benedict BMR
    const bmr = this.calculateBMR(dto.gender, dto.weightKg, dto.heightCm, age);

    // TDEE = BMR * activity multiplier
    const tdee = bmr * ACTIVITY_LEVEL_MULTIPLIER[dto.activityLevel];

    // Adjust by goal
    const dailyCalories = Math.round(tdee + GOAL_CALORIE_ADJUSTMENT[dto.goal]);

    // Macros: 30% protein, 40% carbs, 30% fat
    const macros = Macros.fromCaloriesAndPercentages(dailyCalories, 40, 30, 30);

    const profile = ClientProfile.create({
      userId,
      dateOfBirth,
      gender: dto.gender,
      heightCm: dto.heightCm,
      weightKg: dto.weightKg,
      goal: dto.goal,
      activityLevel: dto.activityLevel,
      dailyCaloriesGoal: dailyCalories,
      dailyMacrosGoal: macros,
    });

    const saved = await this.profileRepository.save(profile);

    return this.toResponse(saved);
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }

  private calculateBMR(
    gender: Gender,
    weightKg: number,
    heightCm: number,
    age: number,
  ): number {
    if (gender === Gender.MALE) {
      return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
    }
    // Female or other
    return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * age;
  }

  private toResponse(profile: ClientProfile): ProfileResponseDto {
    const heightMeters = profile.heightCm / 100;
    return {
      userId: profile.userId,
      dateOfBirth: profile.dateOfBirth,
      age: profile.getAge(),
      gender: profile.gender,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      bmi: Math.round((profile.weightKg / (heightMeters * heightMeters)) * 10) / 10,
      goal: profile.goal,
      activityLevel: profile.activityLevel,
      dailyCaloriesGoal: profile.dailyCaloriesGoal,
      dailyMacrosGoal: {
        carbsGrams: profile.dailyMacrosGoal.carbs,
        proteinGrams: profile.dailyMacrosGoal.protein,
        fatGrams: profile.dailyMacrosGoal.fat,
      },
      isGoalManuallySet: profile.isGoalManuallySet,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
