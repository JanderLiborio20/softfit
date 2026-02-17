import { Injectable, Inject } from '@nestjs/common';
import {
  IMealRepository,
  MEAL_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { MealListResponseDto } from '@application/dtos/meals';

@Injectable()
export class ListMealsUseCase {
  constructor(
    @Inject(MEAL_REPOSITORY_TOKEN)
    private readonly mealRepository: IMealRepository,
  ) {}

  async execute(userId: string, dateStr?: string): Promise<MealListResponseDto> {
    const date = dateStr ? new Date(dateStr) : new Date();

    const meals = await this.mealRepository.findByUserIdAndDate(userId, date);

    const summary = meals.reduce(
      (acc, meal) => ({
        totalCalories: acc.totalCalories + meal.calories,
        totalCarbs: acc.totalCarbs + meal.macros.carbs,
        totalProtein: acc.totalProtein + meal.macros.protein,
        totalFat: acc.totalFat + meal.macros.fat,
      }),
      { totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFat: 0 },
    );

    return {
      meals: meals.map((meal) => ({
        id: meal.id,
        userId: meal.userId,
        name: meal.name,
        imageUrl: meal.imageUrl,
        audioUrl: meal.audioUrl,
        foods: meal.foods,
        calories: meal.calories,
        macros: {
          carbsGrams: meal.macros.carbs,
          proteinGrams: meal.macros.protein,
          fatGrams: meal.macros.fat,
        },
        mealTime: meal.mealTime,
        confidence: meal.confidence,
        canBeEdited: meal.canBeEdited(),
        ageInDays: meal.getAgeInDays(),
        createdAt: meal.createdAt,
        updatedAt: meal.updatedAt,
      })),
      total: meals.length,
      summary,
    };
  }
}
