import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionistsController } from '@presentation/controllers/nutritionists.controller';
import { NutritionistProfileSchema } from '@infrastructure/database/typeorm/entities/nutritionist-profile.schema';
import { ClientNutritionistLinkSchema } from '@infrastructure/database/typeorm/entities/client-nutritionist-link.schema';
import { TypeORMNutritionistProfileRepository } from '@infrastructure/database/typeorm/repositories/nutritionist-profile.repository';
import { TypeORMClientNutritionistLinkRepository } from '@infrastructure/database/typeorm/repositories/client-nutritionist-link.repository';
import {
  NUTRITIONIST_PROFILE_REPOSITORY_TOKEN,
  CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { AuthModule } from '@modules/auth/auth.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { MealsModule } from '@modules/meals/meals.module';
import { CreateNutritionistProfileUseCase } from '@application/use-cases/nutritionists/create-nutritionist-profile.usecase';
import { SearchClientByEmailUseCase } from '@application/use-cases/nutritionists/search-client-by-email.usecase';
import { RequestLinkUseCase } from '@application/use-cases/nutritionists/request-link.usecase';
import { AcceptLinkUseCase } from '@application/use-cases/nutritionists/accept-link.usecase';
import { RejectLinkUseCase } from '@application/use-cases/nutritionists/reject-link.usecase';
import { GetPendingLinksUseCase } from '@application/use-cases/nutritionists/get-pending-links.usecase';
import { GetMyClientsUseCase } from '@application/use-cases/nutritionists/get-my-clients.usecase';
import { GetClientDataUseCase } from '@application/use-cases/nutritionists/get-client-data.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([NutritionistProfileSchema, ClientNutritionistLinkSchema]),
    AuthModule,
    ProfileModule,
    MealsModule,
  ],
  controllers: [NutritionistsController],
  providers: [
    CreateNutritionistProfileUseCase,
    SearchClientByEmailUseCase,
    RequestLinkUseCase,
    AcceptLinkUseCase,
    RejectLinkUseCase,
    GetPendingLinksUseCase,
    GetMyClientsUseCase,
    GetClientDataUseCase,
    {
      provide: NUTRITIONIST_PROFILE_REPOSITORY_TOKEN,
      useClass: TypeORMNutritionistProfileRepository,
    },
    {
      provide: CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN,
      useClass: TypeORMClientNutritionistLinkRepository,
    },
  ],
  exports: [],
})
export class NutritionistsModule {}
