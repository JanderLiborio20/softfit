import { Injectable, Inject } from '@nestjs/common';
import { Meal } from '@domain/entities';
import { Macros } from '@domain/value-objects';
import {
  IMealRepository,
  MEAL_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { ConfirmMealDto, MealResponseDto } from '@application/dtos/meals';

@Injectable()
export class ConfirmMealUseCase {
  constructor(
    @Inject(MEAL_REPOSITORY_TOKEN)
    private readonly mealRepository: IMealRepository,
  ) {}

  async execute(userId: string, dto: ConfirmMealDto): Promise<MealResponseDto> {
    const macros = new Macros(
      dto.macros.carbsGrams,
      dto.macros.proteinGrams,
      dto.macros.fatGrams,
    );

    const meal = Meal.create({
      userId,
      name: dto.name,
      imageUrl: 'manual',
      foods: dto.foods,
      calories: dto.calories,
      macros,
      mealTime: dto.mealTime,
      confidence: 100,
    });

    const saved = await this.mealRepository.save(meal);

    return {
      id: saved.id,
      userId: saved.userId,
      name: saved.name,
      imageUrl: saved.imageUrl,
      audioUrl: saved.audioUrl,
      foods: saved.foods,
      calories: saved.calories,
      macros: {
        carbsGrams: saved.macros.carbs,
        proteinGrams: saved.macros.protein,
        fatGrams: saved.macros.fat,
      },
      mealTime: saved.mealTime,
      confidence: saved.confidence,
      canBeEdited: saved.canBeEdited(),
      ageInDays: saved.getAgeInDays(),
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
