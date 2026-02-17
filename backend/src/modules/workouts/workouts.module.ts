import { Module } from '@nestjs/common';
import { WorkoutsController } from '@presentation/controllers/workouts.controller';

/**
 * Módulo de Treinos
 * Gerencia fichas de treino e exercícios
 */
@Module({
  imports: [],
  controllers: [WorkoutsController],
  providers: [
    // TODO: Adicionar use cases e repositories
  ],
  exports: [],
})
export class WorkoutsModule {}
