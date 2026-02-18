import { Injectable, Inject, Logger } from '@nestjs/common';
import { IAIService } from '@application/ports/services/ai.service.interface';
import { AI_SERVICE_TOKEN } from './process-meal-photo.usecase';
import {
  IMealRepository,
  IClientProfileRepository,
  MEAL_REPOSITORY_TOKEN,
  CLIENT_PROFILE_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { RecipeSuggestionsResponseDto } from '@application/dtos/meals';

const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 67,
};

@Injectable()
export class SuggestRecipesUseCase {
  private readonly logger = new Logger(SuggestRecipesUseCase.name);

  constructor(
    @Inject(AI_SERVICE_TOKEN)
    private readonly aiService: IAIService,

    @Inject(MEAL_REPOSITORY_TOKEN)
    private readonly mealRepository: IMealRepository,

    @Inject(CLIENT_PROFILE_REPOSITORY_TOKEN)
    private readonly clientProfileRepository: IClientProfileRepository,
  ) {}

  async execute(userId: string): Promise<RecipeSuggestionsResponseDto> {
    this.logger.log(`Suggesting recipes for user: ${userId}`);

    const profile = await this.clientProfileRepository.findByUserId(userId);
    const goals = profile
      ? {
          calories: profile.dailyCaloriesGoal,
          protein: profile.dailyMacrosGoal.protein,
          carbs: profile.dailyMacrosGoal.carbs,
          fat: profile.dailyMacrosGoal.fat,
        }
      : DEFAULT_GOALS;

    const today = new Date();
    const [consumedMacros, consumedCalories] = await Promise.all([
      this.mealRepository.getTotalMacrosByUserAndDate(userId, today),
      this.mealRepository.getTotalCaloriesByUserAndDate(userId, today),
    ]);

    const remainingCalories = Math.max(0, goals.calories - consumedCalories);
    const remainingProtein = Math.max(0, goals.protein - consumedMacros.protein);
    const remainingCarbs = Math.max(0, goals.carbs - consumedMacros.carbs);
    const remainingFat = Math.max(0, goals.fat - consumedMacros.fat);

    this.logger.log(
      `Remaining: ${remainingCalories}kcal, P:${remainingProtein}g C:${remainingCarbs}g F:${remainingFat}g`,
    );

    const recipes = await this.aiService.suggestRecipes(remainingCalories, {
      carbs: remainingCarbs,
      protein: remainingProtein,
      fat: remainingFat,
    });

    return {
      recipes,
      remainingMacros: {
        remainingCalories,
        remainingCarbs,
        remainingProtein,
        remainingFat,
      },
    };
  }
}
