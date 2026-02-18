import { NutritionPlan } from '@domain/entities';

export interface INutritionPlanRepository {
  save(plan: NutritionPlan): Promise<NutritionPlan>;
  findById(id: string): Promise<NutritionPlan | null>;
  findByClientId(clientId: string): Promise<NutritionPlan[]>;
  findActiveByClientId(clientId: string): Promise<NutritionPlan | null>;
  findByNutritionistId(nutritionistId: string): Promise<NutritionPlan[]>;
  update(plan: NutritionPlan): Promise<NutritionPlan>;
  delete(id: string): Promise<void>;
}
