import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IClientProfileRepository,
  CLIENT_PROFILE_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { ProfileResponseDto } from '@application/dtos/profile';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(CLIENT_PROFILE_REPOSITORY_TOKEN)
    private readonly profileRepository: IClientProfileRepository,
  ) {}

  async execute(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado. Complete o onboarding.');
    }

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
