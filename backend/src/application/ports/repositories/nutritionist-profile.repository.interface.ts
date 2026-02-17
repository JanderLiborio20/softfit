import { NutritionistProfile } from '@domain/entities';

export interface INutritionistProfileRepository {
  save(profile: NutritionistProfile): Promise<NutritionistProfile>;
  findByUserId(userId: string): Promise<NutritionistProfile | null>;
  update(profile: NutritionistProfile): Promise<NutritionistProfile>;
}
