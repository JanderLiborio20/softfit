import { Injectable, Inject, Logger } from '@nestjs/common';
import { IAIService } from '@application/ports/services/ai.service.interface';
import { AIProcessingResponseDto } from '@application/dtos/meals';

export const AI_SERVICE_TOKEN = 'IAIService';

@Injectable()
export class ProcessMealPhotoUseCase {
  private readonly logger = new Logger(ProcessMealPhotoUseCase.name);

  constructor(
    @Inject(AI_SERVICE_TOKEN)
    private readonly aiService: IAIService,
  ) {}

  async execute(
    file: Express.Multer.File,
  ): Promise<AIProcessingResponseDto> {
    this.logger.log(`Processing photo: ${file.originalname}, size: ${file.size}`);

    const base64 = file.buffer.toString('base64');
    const mimeType = file.mimetype || 'image/jpeg';

    const result = await this.aiService.analyzeFoodImageBase64(base64, mimeType);

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
