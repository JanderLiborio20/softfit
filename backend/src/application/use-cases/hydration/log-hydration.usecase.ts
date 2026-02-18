import { Injectable, Inject } from '@nestjs/common';
import { Hydration } from '@domain/entities';
import {
  IHydrationRepository,
  HYDRATION_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { LogHydrationDto, HydrationResponseDto } from '@application/dtos/hydration';

@Injectable()
export class LogHydrationUseCase {
  constructor(
    @Inject(HYDRATION_REPOSITORY_TOKEN)
    private readonly hydrationRepository: IHydrationRepository,
  ) {}

  async execute(userId: string, dto: LogHydrationDto): Promise<HydrationResponseDto> {
    const hydration = Hydration.create({
      userId,
      volumeMl: dto.volumeMl,
      drinkType: dto.drinkType,
      timestamp: dto.timestamp,
    });

    const saved = await this.hydrationRepository.save(hydration);

    return {
      id: saved.id,
      userId: saved.userId,
      volumeMl: saved.volumeMl,
      drinkType: saved.drinkType,
      drinkIcon: saved.getDrinkIcon(),
      timestamp: saved.timestamp,
      createdAt: saved.createdAt,
    };
  }
}
