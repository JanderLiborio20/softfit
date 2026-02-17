import { Module } from '@nestjs/common';
import { DashboardController } from '@presentation/controllers/dashboard.controller';

/**
 * Módulo de Dashboard
 * Gerencia visualização de métricas e progresso
 */
@Module({
  imports: [],
  controllers: [DashboardController],
  providers: [
    // TODO: Adicionar use cases
  ],
  exports: [],
})
export class DashboardModule {}
