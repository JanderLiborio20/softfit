import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { NutritionPlan } from '@domain/entities';
import {
  INutritionPlanRepository,
  NUTRITION_PLAN_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { NutritionPlanResponseDto } from '@application/dtos/nutritionists';

@Injectable()
export class DeactivateNutritionPlanUseCase {
  constructor(
    @Inject(NUTRITION_PLAN_REPOSITORY_TOKEN)
    private readonly planRepo: INutritionPlanRepository,
  ) {}

  async execute(
    nutritionistId: string,
    planId: string,
  ): Promise<NutritionPlanResponseDto> {
    const plan = await this.planRepo.findById(planId);
    if (!plan) {
      throw new NotFoundException('Plano alimentar não encontrado');
    }

    if (plan.nutritionistId !== nutritionistId) {
      throw new ForbiddenException('Apenas o nutricionista que criou o plano pode desativá-lo');
    }

    const deactivated = plan.deactivate();
    await this.planRepo.update(deactivated);

    return this.toResponse(deactivated);
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
