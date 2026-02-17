import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { LinkStatus } from '@domain/enums';
import {
  IClientNutritionistLinkRepository,
  CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN,
  IClientProfileRepository,
  CLIENT_PROFILE_REPOSITORY_TOKEN,
  IMealRepository,
  MEAL_REPOSITORY_TOKEN,
} from '@application/ports/repositories';

@Injectable()
export class GetClientDataUseCase {
  constructor(
    @Inject(CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN)
    private readonly linkRepo: IClientNutritionistLinkRepository,
    @Inject(CLIENT_PROFILE_REPOSITORY_TOKEN)
    private readonly profileRepo: IClientProfileRepository,
    @Inject(MEAL_REPOSITORY_TOKEN)
    private readonly mealRepo: IMealRepository,
  ) {}

  async execute(nutritionistUserId: string, clientId: string): Promise<any> {
    const link = await this.linkRepo.findByClientAndNutritionist(
      clientId,
      nutritionistUserId,
      [LinkStatus.ACTIVE],
    );
    if (!link) {
      throw new ForbiddenException('Você não tem vínculo ativo com este cliente');
    }

    const profile = await this.profileRepo.findByUserId(clientId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meals = await this.mealRepo.findByUserIdAndDate(clientId, today);

    if (!profile) {
      return {
        profile: {
          userId: clientId,
          dateOfBirth: null,
          age: null,
          gender: null,
          heightCm: null,
          weightKg: null,
          bmi: null,
          goal: null,
          activityLevel: null,
          dailyCaloriesGoal: null,
          dailyMacrosGoal: null,
        },
        meals: meals.map((meal) => ({
          id: meal.id,
          name: meal.name,
          foods: meal.foods,
          calories: meal.calories,
          macros: {
            carbsGrams: meal.macros.carbs,
            proteinGrams: meal.macros.protein,
            fatGrams: meal.macros.fat,
          },
          mealTime: meal.mealTime,
        })),
      };
    }

    const heightMeters = profile.heightCm / 100;

    return {
      profile: {
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
      },
      meals: meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        foods: meal.foods,
        calories: meal.calories,
        macros: {
          carbsGrams: meal.macros.carbs,
          proteinGrams: meal.macros.protein,
          fatGrams: meal.macros.fat,
        },
        mealTime: meal.mealTime,
      })),
    };
  }
}
