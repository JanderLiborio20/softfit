import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MealsController } from '@presentation/controllers/meals.controller';
import { MealSchema } from '@infrastructure/database/typeorm/entities/meal.schema';
import { ClientProfileSchema } from '@infrastructure/database/typeorm/entities/client-profile.schema';
import { TypeORMMealRepository } from '@infrastructure/database/typeorm/repositories/meal.repository';
import { TypeORMClientProfileRepository } from '@infrastructure/database/typeorm/repositories/client-profile.repository';
import { GroqAIService } from '@infrastructure/services/ai/groq-ai.service';
import { MEAL_REPOSITORY_TOKEN, CLIENT_PROFILE_REPOSITORY_TOKEN } from '@application/ports/repositories';
import { ListMealsUseCase } from '@application/use-cases/meals/list-meals.usecase';
import { ConfirmMealUseCase } from '@application/use-cases/meals/confirm-meal.usecase';
import { ProcessMealPhotoUseCase, AI_SERVICE_TOKEN } from '@application/use-cases/meals/process-meal-photo.usecase';
import { ProcessMealDescriptionUseCase } from '@application/use-cases/meals/process-meal-description.usecase';
import { SuggestRecipesUseCase } from '@application/use-cases/meals/suggest-recipes.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([MealSchema, ClientProfileSchema]), ConfigModule],
  controllers: [MealsController],
  providers: [
    ListMealsUseCase,
    ConfirmMealUseCase,
    ProcessMealPhotoUseCase,
    ProcessMealDescriptionUseCase,
    SuggestRecipesUseCase,
    {
      provide: MEAL_REPOSITORY_TOKEN,
      useClass: TypeORMMealRepository,
    },
    {
      provide: CLIENT_PROFILE_REPOSITORY_TOKEN,
      useClass: TypeORMClientProfileRepository,
    },
    {
      provide: AI_SERVICE_TOKEN,
      useClass: GroqAIService,
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
