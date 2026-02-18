import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { NutritionPlan } from '@domain/entities';
import {
  INutritionPlanRepository,
  NUTRITION_PLAN_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { NutritionPlanResponseDto } from '@application/dtos/nutritionists';

@Injectable()
export class GetNutritionPlanUseCase {
  constructor(
    @Inject(NUTRITION_PLAN_REPOSITORY_TOKEN)
    private readonly planRepo: INutritionPlanRepository,
  ) {}

  async execute(
    userId: string,
    planId: string,
  ): Promise<NutritionPlanResponseDto> {
    const plan = await this.planRepo.findById(planId);
    if (!plan) {
      throw new NotFoundException('Plano alimentar não encontrado');
    }

    // Only the nutritionist who created or the client can view
    if (plan.nutritionistId !== userId && plan.clientId !== userId) {
      throw new ForbiddenException('Sem permissão para visualizar este plano');
    }

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
