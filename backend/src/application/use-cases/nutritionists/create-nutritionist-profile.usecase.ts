import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { NutritionistProfile } from '@domain/entities';
import {
  INutritionistProfileRepository,
  NUTRITIONIST_PROFILE_REPOSITORY_TOKEN,
} from '@application/ports/repositories';
import { CreateNutritionistProfileDto, NutritionistProfileResponseDto } from '@application/dtos/nutritionists';

@Injectable()
export class CreateNutritionistProfileUseCase {
  constructor(
    @Inject(NUTRITIONIST_PROFILE_REPOSITORY_TOKEN)
    private readonly nutritionistRepo: INutritionistProfileRepository,
  ) {}

  async execute(userId: string, dto: CreateNutritionistProfileDto): Promise<NutritionistProfileResponseDto> {
    const existing = await this.nutritionistRepo.findByUserId(userId);
    if (existing) {
      throw new ConflictException('Perfil de nutricionista já existe');
    }

    const profile = NutritionistProfile.create({
      userId,
      crn: dto.crn,
      crnState: dto.crnState,
      fullName: dto.fullName,
      bio: dto.bio,
      specialties: dto.specialties,
    });

    const saved = await this.nutritionistRepo.save(profile);

    return {
      userId: saved.userId,
      fullName: saved.fullName,
      crn: saved.crn,
      crnState: saved.crnState,
      bio: saved.bio,
      specialties: saved.specialties,
      isVerified: saved.isVerified,
      activeClientsCount: saved.activeClientsCount,
      createdAt: saved.createdAt,
    };
  }
}
