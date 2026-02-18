import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  IHydrationRepository,
  HYDRATION_REPOSITORY_TOKEN,
} from '@application/ports/repositories';

@Injectable()
export class DeleteHydrationUseCase {
  constructor(
    @Inject(HYDRATION_REPOSITORY_TOKEN)
    private readonly hydrationRepository: IHydrationRepository,
  ) {}

  async execute(userId: string, hydrationId: string): Promise<void> {
    const hydration = await this.hydrationRepository.findById(hydrationId);

    if (!hydration) {
      throw new NotFoundException('Registro de hidratação não encontrado');
    }

    if (hydration.userId !== userId) {
      throw new ForbiddenException('Você não pode deletar este registro');
    }

    await this.hydrationRepository.delete(hydrationId);
  }
}
