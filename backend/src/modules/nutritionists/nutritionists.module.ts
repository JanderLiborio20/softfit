import { Module } from '@nestjs/common';
import { NutritionistsController } from '@presentation/controllers/nutritionists.controller';

/**
 * Módulo de Nutricionistas
 * Gerencia nutricionistas, vínculos e planos alimentares
 */
@Module({
  imports: [],
  controllers: [NutritionistsController],
  providers: [
    // TODO: Adicionar use cases e repositories
  ],
  exports: [],
})
export class NutritionistsModule {}
