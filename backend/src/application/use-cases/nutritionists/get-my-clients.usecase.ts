import { Injectable, Inject } from '@nestjs/common';
import {
  IClientNutritionistLinkRepository,
  CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN,
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@application/ports/repositories';

export interface LinkedClientResponse {
  userId: string;
  name: string;
  email: string;
  linkedAt: Date;
}

@Injectable()
export class GetMyClientsUseCase {
  constructor(
    @Inject(CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN)
    private readonly linkRepo: IClientNutritionistLinkRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(nutritionistUserId: string): Promise<LinkedClientResponse[]> {
    const links = await this.linkRepo.findActiveByNutritionistId(nutritionistUserId);

    const results = await Promise.all(
      links.map(async (link) => {
        const user = await this.userRepo.findById(link.clientId);
        return {
          userId: link.clientId,
          name: user?.name || 'Desconhecido',
          email: user ? user.getEmail() : '',
          linkedAt: link.respondedAt || link.requestedAt,
        };
      }),
    );

    return results;
  }
}
