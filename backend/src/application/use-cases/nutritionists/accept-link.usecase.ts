import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  IClientNutritionistLinkRepository,
  CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN,
  INutritionistProfileRepository,
  NUTRITIONIST_PROFILE_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { LinkResponseDto } from '@application/dtos/nutritionists';

@Injectable()
export class AcceptLinkUseCase {
  constructor(
    @Inject(CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN)
    private readonly linkRepo: IClientNutritionistLinkRepository,
    @Inject(NUTRITIONIST_PROFILE_REPOSITORY_TOKEN)
    private readonly nutritionistRepo: INutritionistProfileRepository,
  ) {}

  async execute(clientUserId: string, linkId: string): Promise<LinkResponseDto> {
    const link = await this.linkRepo.findById(linkId);
    if (!link) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    if (link.clientId !== clientUserId) {
      throw new ForbiddenException('Sem permissão para aceitar esta solicitação');
    }

    const accepted = link.accept();
    await this.linkRepo.update(accepted);

    const profile = await this.nutritionistRepo.findByUserId(link.nutritionistId);
    if (profile) {
      const updated = profile.incrementActiveClients();
      await this.nutritionistRepo.update(updated);
    }

    return {
      id: accepted.id,
      clientId: accepted.clientId,
      nutritionistId: accepted.nutritionistId,
      status: accepted.status,
      requestedAt: accepted.requestedAt,
      respondedAt: accepted.respondedAt,
      endedAt: accepted.endedAt,
    };
  }
}
