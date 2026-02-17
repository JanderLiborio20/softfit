import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from '@presentation/controllers/profile.controller';
import { ClientProfileSchema } from '@infrastructure/database/typeorm/entities/client-profile.schema';
import { TypeORMClientProfileRepository } from '@infrastructure/database/typeorm/repositories/client-profile.repository';
import { CLIENT_PROFILE_REPOSITORY_TOKEN } from '@application/ports/repositories';
import { CompleteOnboardingUseCase } from '@application/use-cases/profile/complete-onboarding.usecase';
import { GetProfileUseCase } from '@application/use-cases/profile/get-profile.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([ClientProfileSchema])],
  controllers: [ProfileController],
  providers: [
    CompleteOnboardingUseCase,
    GetProfileUseCase,
    {
      provide: CLIENT_PROFILE_REPOSITORY_TOKEN,
      useClass: TypeORMClientProfileRepository,
    },
  ],
  exports: [
    GetProfileUseCase,
    {
      provide: CLIENT_PROFILE_REPOSITORY_TOKEN,
      useClass: TypeORMClientProfileRepository,
    },
  ],
})
export class ProfileModule {}
