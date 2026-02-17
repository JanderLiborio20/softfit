import { Injectable, Inject, Logger } from '@nestjs/common';
import { IAIService } from '@application/ports/services/ai.service.interface';
import { AIProcessingResponseDto } from '@application/dtos/meals';
import { AI_SERVICE_TOKEN } from './process-meal-photo.usecase';

@Injectable()
export class ProcessMealDescriptionUseCase {
  private readonly logger = new Logger(ProcessMealDescriptionUseCase.name);

  constructor(
    @Inject(AI_SERVICE_TOKEN)
    private readonly aiService: IAIService,
  ) {}

  async execute(description: string): Promise<AIProcessingResponseDto> {
    this.logger.log(`Processing meal description: ${description}`);

    const result = await this.aiService.analyzeFoodDescription(description);

    return {
      suggestedName: result.mealName,
      identifiedFoods: result.foods,
      estimatedCalories: result.calories,
      estimatedMacros: {
        carbsGrams: result.macros.carbs,
        proteinGrams: result.macros.protein,
        fatGrams: result.macros.fat,
      },
      confidence: result.confidence,
      tempFileUrl: '',
      tempId: '',
    };
  }
}
