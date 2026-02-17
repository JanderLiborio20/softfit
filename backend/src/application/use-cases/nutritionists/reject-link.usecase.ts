import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  IClientNutritionistLinkRepository,
  CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { LinkResponseDto } from '@application/dtos/nutritionists';

@Injectable()
export class RejectLinkUseCase {
  constructor(
    @Inject(CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN)
    private readonly linkRepo: IClientNutritionistLinkRepository,
  ) {}

  async execute(clientUserId: string, linkId: string): Promise<LinkResponseDto> {
    const link = await this.linkRepo.findById(linkId);
    if (!link) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    if (link.clientId !== clientUserId) {
      throw new ForbiddenException('Sem permissão para rejeitar esta solicitação');
    }

    const rejected = link.reject();
    await this.linkRepo.update(rejected);

    return {
      id: rejected.id,
      clientId: rejected.clientId,
      nutritionistId: rejected.nutritionistId,
      status: rejected.status,
      requestedAt: rejected.requestedAt,
      respondedAt: rejected.respondedAt,
      endedAt: rejected.endedAt,
    };
  }
}
