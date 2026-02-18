import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { NutritionPlan } from '@domain/entities';
import { LinkStatus } from '@domain/enums';
import {
  INutritionPlanRepository,
  NUTRITION_PLAN_REPOSITORY_TOKEN,
  IClientNutritionistLinkRepository,
  CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { CreateNutritionPlanDto, NutritionPlanResponseDto } from '@application/dtos/nutritionists';

@Injectable()
export class CreateNutritionPlanUseCase {
  constructor(
    @Inject(NUTRITION_PLAN_REPOSITORY_TOKEN)
    private readonly planRepo: INutritionPlanRepository,
    @Inject(CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN)
    private readonly linkRepo: IClientNutritionistLinkRepository,
  ) {}

  async execute(
    nutritionistId: string,
    dto: CreateNutritionPlanDto,
  ): Promise<NutritionPlanResponseDto> {
    // Verify active link with client
    const link = await this.linkRepo.findByClientAndNutritionist(
      dto.clientId,
      nutritionistId,
      [LinkStatus.ACTIVE],
    );
    if (!link) {
      throw new ForbiddenException('Você não tem vínculo ativo com este cliente');
    }

    // Deactivate any existing active plan for this client
    const existingPlan = await this.planRepo.findActiveByClientId(dto.clientId);
    if (existingPlan) {
      const deactivated = existingPlan.deactivate();
      await this.planRepo.update(deactivated);
    }

    // Create new plan
    const plan = NutritionPlan.create({
      nutritionistId,
      clientId: dto.clientId,
      title: dto.title,
      description: dto.description,
      plannedMeals: dto.plannedMeals,
      generalGuidelines: dto.generalGuidelines,
      durationDays: dto.durationDays,
      startDate: dto.startDate,
    });

    const saved = await this.planRepo.save(plan);

    return this.toResponse(saved);
  }

  private toResponse(plan: NutritionPlan): NutritionPlanResponseDto {
    return {
      id: plan.id,
      nutritionistId: plan.nutritionistId,
      clientId: plan.clientId,
      title: plan.title,
      description: plan.description,
      plannedMeals: plan.plannedMeals,
      generalGuidelines: plan.generalGuidelines,
      durationDays: plan.durationDays,
      startDate: plan.startDate,
      endDate: plan.endDate,
      isActive: plan.isActive,
      daysRemaining: plan.getDaysRemaining(),
      isExpired: plan.isExpired(),
      createdAt: plan.createdAt,
    };
  }
}
