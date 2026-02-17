import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MealsController } from '@presentation/controllers/meals.controller';
import { MealSchema } from '@infrastructure/database/typeorm/entities/meal.schema';
import { TypeORMMealRepository } from '@infrastructure/database/typeorm/repositories/meal.repository';
import { ClaudeAIService } from '@infrastructure/services/ai/claude-ai.service';
import { MEAL_REPOSITORY_TOKEN } from '@application/ports/repositories';
import { ListMealsUseCase } from '@application/use-cases/meals/list-meals.usecase';
import { ConfirmMealUseCase } from '@application/use-cases/meals/confirm-meal.usecase';
import { ProcessMealPhotoUseCase, AI_SERVICE_TOKEN } from '@application/use-cases/meals/process-meal-photo.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([MealSchema]), ConfigModule],
  controllers: [MealsController],
  providers: [
    ListMealsUseCase,
    ConfirmMealUseCase,
    ProcessMealPhotoUseCase,
    {
      provide: MEAL_REPOSITORY_TOKEN,
      useClass: TypeORMMealRepository,
    },
    {
      provide: AI_SERVICE_TOKEN,
      useClass: ClaudeAIService,
    },
  ],
  exports: [
    ListMealsUseCase,
    {
      provide: MEAL_REPOSITORY_TOKEN,
      useClass: TypeORMMealRepository,
    },
  ],
})
export class MealsModule {}
