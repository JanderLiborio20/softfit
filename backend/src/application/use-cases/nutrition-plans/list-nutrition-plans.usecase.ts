import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { NutritionPlan } from '@domain/entities';
import { LinkStatus } from '@domain/enums';
import {
  INutritionPlanRepository,
  NUTRITION_PLAN_REPOSITORY_TOKEN,
  IClientNutritionistLinkRepository,
  CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { NutritionPlanResponseDto } from '@application/dtos/nutritionists';

@Injectable()
export class ListNutritionPlansUseCase {
  constructor(
    @Inject(NUTRITION_PLAN_REPOSITORY_TOKEN)
    private readonly planRepo: INutritionPlanRepository,
    @Inject(CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN)
    private readonly linkRepo: IClientNutritionistLinkRepository,
  ) {}

  /**
   * List plans for a client (called by nutritionist)
   */
  async executeForNutritionist(
    nutritionistId: string,
    clientId: string,
  ): Promise<NutritionPlanResponseDto[]> {
    const link = await this.linkRepo.findByClientAndNutritionist(
      clientId,
      nutritionistId,
      [LinkStatus.ACTIVE],
    );
    if (!link) {
      throw new ForbiddenException('Você não tem vínculo ativo com este cliente');
    }

    const plans = await this.planRepo.findByClientId(clientId);
    return plans.map((p) => this.toResponse(p));
  }

  /**
   * Get active plan for the authenticated client
   */
  async executeForClient(clientId: string): Promise<NutritionPlanResponseDto | null> {
    const plan = await this.planRepo.findActiveByClientId(clientId);
    if (!plan) return null;
    return this.toResponse(plan);
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
