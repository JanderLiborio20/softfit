import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ClientProfile } from '@domain/entities';
import { Gender } from '@domain/enums';
import { ACTIVITY_LEVEL_MULTIPLIER } from '@domain/enums/activity-level.enum';
import { GOAL_CALORIE_ADJUSTMENT } from '@domain/enums/user-goal.enum';
import { Macros } from '@domain/value-objects';
import {
  IClientProfileRepository,
  CLIENT_PROFILE_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { UpdateProfileDto, ProfileResponseDto } from '@application/dtos/profile';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(CLIENT_PROFILE_REPOSITORY_TOKEN)
    private readonly profileRepository: IClientProfileRepository,
  ) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    const dateOfBirth = dto.dateOfBirth !== undefined ? new Date(dto.dateOfBirth) : profile.dateOfBirth;
    const gender = dto.gender !== undefined ? dto.gender : profile.gender;
    const heightCm = dto.heightCm !== undefined ? dto.heightCm : profile.heightCm;
    const weightKg = dto.weightKg !== undefined ? dto.weightKg : profile.weightKg;
    const goal = dto.goal !== undefined ? dto.goal : profile.goal;
    const activityLevel = dto.activityLevel !== undefined ? dto.activityLevel : profile.activityLevel;

    // Recalculate goals
    const tempProfile = ClientProfile.reconstitute({
      ...profileToData(profile),
      dateOfBirth,
      gender,
      heightCm,
      weightKg,
      goal,
      activityLevel,
    });

    const age = tempProfile.getAge();
    const bmr = this.calculateBMR(gender, weightKg, heightCm, age);
    const tdee = bmr * ACTIVITY_LEVEL_MULTIPLIER[activityLevel];
    const dailyCalories = Math.round(tdee + GOAL_CALORIE_ADJUSTMENT[goal]);
    const macros = Macros.fromCaloriesAndPercentages(dailyCalories, 40, 30, 30);

    const updated = ClientProfile.reconstitute({
      userId: profile.userId,
      dateOfBirth,
      gender,
      heightCm,
      weightKg,
      goal,
      activityLevel,
      dailyCaloriesGoal: dailyCalories,
      dailyMacrosGoal: macros,
      isGoalManuallySet: profile.isGoalManuallySet,
      createdAt: profile.createdAt,
      updatedAt: new Date(),
    });

    const saved = await this.profileRepository.update(updated);

    const heightMeters = saved.heightCm / 100;
    return {
      userId: saved.userId,
      dateOfBirth: saved.dateOfBirth,
      age: saved.getAge(),
      gender: saved.gender,
      heightCm: saved.heightCm,
      weightKg: saved.weightKg,
      bmi: Math.round((saved.weightKg / (heightMeters * heightMeters)) * 10) / 10,
      goal: saved.goal,
      activityLevel: saved.activityLevel,
      dailyCaloriesGoal: saved.dailyCaloriesGoal,
      dailyMacrosGoal: {
        carbsGrams: saved.dailyMacrosGoal.carbs,
        proteinGrams: saved.dailyMacrosGoal.protein,
        fatGrams: saved.dailyMacrosGoal.fat,
      },
      isGoalManuallySet: saved.isGoalManuallySet,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
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
    return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * age;
  }
}

function profileToData(profile: ClientProfile) {
  return {
    userId: profile.userId,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    goal: profile.goal,
    activityLevel: profile.activityLevel,
    dailyCaloriesGoal: profile.dailyCaloriesGoal,
    dailyMacrosGoal: profile.dailyMacrosGoal,
    isGoalManuallySet: profile.isGoalManuallySet,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}
