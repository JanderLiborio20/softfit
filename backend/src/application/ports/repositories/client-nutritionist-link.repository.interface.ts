import { ClientNutritionistLink } from '@domain/entities';
import { LinkStatus } from '@domain/enums';

export interface IClientNutritionistLinkRepository {
  save(link: ClientNutritionistLink): Promise<ClientNutritionistLink>;
  findById(id: string): Promise<ClientNutritionistLink | null>;
  update(link: ClientNutritionistLink): Promise<ClientNutritionistLink>;
  findByClientAndNutritionist(
    clientId: string,
    nutritionistId: string,
    statuses?: LinkStatus[],
  ): Promise<ClientNutritionistLink | null>;
  findPendingByClientId(clientId: string): Promise<ClientNutritionistLink[]>;
  findActiveByNutritionistId(nutritionistId: string): Promise<ClientNutritionistLink[]>;
}
