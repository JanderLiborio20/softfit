import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HydrationController } from '@presentation/controllers/hydration.controller';
import { HydrationSchema } from '@infrastructure/database/typeorm/entities/hydration.schema';
import { TypeORMHydrationRepository } from '@infrastructure/database/typeorm/repositories/hydration.repository';
import { HYDRATION_REPOSITORY_TOKEN } from '@application/ports/repositories';
import { LogHydrationUseCase } from '@application/use-cases/hydration/log-hydration.usecase';
import { ListHydrationUseCase } from '@application/use-cases/hydration/list-hydration.usecase';
import { DeleteHydrationUseCase } from '@application/use-cases/hydration/delete-hydration.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([HydrationSchema]), ConfigModule],
  controllers: [HydrationController],
  providers: [
    LogHydrationUseCase,
    ListHydrationUseCase,
    DeleteHydrationUseCase,
    {
      provide: HYDRATION_REPOSITORY_TOKEN,
      useClass: TypeORMHydrationRepository,
    },
  ],
  exports: [
    ListHydrationUseCase,
    {
      provide: HYDRATION_REPOSITORY_TOKEN,
      useClass: TypeORMHydrationRepository,
    },
  ],
})
export class HydrationModule {}
