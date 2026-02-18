import { Injectable, Inject } from '@nestjs/common';
import {
  IHydrationRepository,
  HYDRATION_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { HydrationDailyResponseDto } from '@application/dtos/hydration';

const DEFAULT_DAILY_GOAL_ML = 2000;

@Injectable()
export class ListHydrationUseCase {
  constructor(
    @Inject(HYDRATION_REPOSITORY_TOKEN)
    private readonly hydrationRepository: IHydrationRepository,
  ) {}

  async execute(userId: string, dateStr?: string): Promise<HydrationDailyResponseDto> {
    const date = dateStr ? new Date(dateStr) : new Date();

    const hydrations = await this.hydrationRepository.findByUserIdAndDate(userId, date);

    const totalVolumeMl = hydrations.reduce((sum, h) => sum + h.volumeMl, 0);
    const dailyGoalMl = DEFAULT_DAILY_GOAL_ML;
    const progressPercent = Math.min((totalVolumeMl / dailyGoalMl) * 100, 100);

    return {
      entries: hydrations.map((h) => ({
        id: h.id,
        userId: h.userId,
        volumeMl: h.volumeMl,
        drinkType: h.drinkType,
        drinkIcon: h.getDrinkIcon(),
        timestamp: h.timestamp,
        createdAt: h.createdAt,
      })),
      total: hydrations.length,
      totalVolumeMl,
      dailyGoalMl,
      progressPercent: Math.round(progressPercent * 10) / 10,
    };
  }
}
