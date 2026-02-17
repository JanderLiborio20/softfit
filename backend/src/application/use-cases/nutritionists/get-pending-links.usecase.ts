import { Injectable, Inject } from '@nestjs/common';
import {
  IClientNutritionistLinkRepository,
  CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN,
  INutritionistProfileRepository,
  NUTRITIONIST_PROFILE_REPOSITORY_TOKEN,
} from '@application/ports/repositories';

export interface PendingLinkResponse {
  id: string;
  nutritionistId: string;
  nutritionistName: string;
  nutritionistCrn: string;
  requestedAt: Date;
  status: string;
}

@Injectable()
export class GetPendingLinksUseCase {
  constructor(
    @Inject(CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN)
    private readonly linkRepo: IClientNutritionistLinkRepository,
    @Inject(NUTRITIONIST_PROFILE_REPOSITORY_TOKEN)
    private readonly nutritionistRepo: INutritionistProfileRepository,
  ) {}

  async execute(clientUserId: string): Promise<PendingLinkResponse[]> {
    const links = await this.linkRepo.findPendingByClientId(clientUserId);

    const results = await Promise.all(
      links.map(async (link) => {
        const profile = await this.nutritionistRepo.findByUserId(link.nutritionistId);
        return {
          id: link.id,
          nutritionistId: link.nutritionistId,
          nutritionistName: profile?.fullName || 'Desconhecido',
          nutritionistCrn: profile ? `${profile.crn}/${profile.crnState}` : '',
          requestedAt: link.requestedAt,
          status: link.status,
        };
      }),
    );

    return results;
  }
}
