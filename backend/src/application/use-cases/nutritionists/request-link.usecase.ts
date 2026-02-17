import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ClientNutritionistLink } from '@domain/entities';
import { LinkStatus } from '@domain/enums';
import {
  INutritionistProfileRepository,
  NUTRITIONIST_PROFILE_REPOSITORY_TOKEN,
  IClientNutritionistLinkRepository,
  CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN,
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { LinkResponseDto } from '@application/dtos/nutritionists';

@Injectable()
export class RequestLinkUseCase {
  constructor(
    @Inject(NUTRITIONIST_PROFILE_REPOSITORY_TOKEN)
    private readonly nutritionistRepo: INutritionistProfileRepository,
    @Inject(CLIENT_NUTRITIONIST_LINK_REPOSITORY_TOKEN)
    private readonly linkRepo: IClientNutritionistLinkRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(nutritionistUserId: string, clientId: string): Promise<LinkResponseDto> {
    const profile = await this.nutritionistRepo.findByUserId(nutritionistUserId);
    if (!profile) {
      throw new NotFoundException('Perfil de nutricionista não encontrado. Crie seu perfil primeiro.');
    }

    const client = await this.userRepo.findById(clientId);
    if (!client || !client.isClient()) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const existing = await this.linkRepo.findByClientAndNutritionist(
      clientId,
      nutritionistUserId,
      [LinkStatus.PENDING, LinkStatus.ACTIVE],
    );
    if (existing) {
      throw new ConflictException('Já existe um vínculo pendente ou ativo com este cliente');
    }

    if (!profile.canAcceptMoreClients()) {
      throw new ConflictException('Limite de clientes atingido');
    }

    const link = ClientNutritionistLink.createRequest({
      clientId,
      nutritionistId: nutritionistUserId,
    });

    const saved = await this.linkRepo.save(link);

    return {
      id: saved.id,
      clientId: saved.clientId,
      nutritionistId: saved.nutritionistId,
      status: saved.status,
      requestedAt: saved.requestedAt,
      respondedAt: saved.respondedAt,
      endedAt: saved.endedAt,
    };
  }
}
