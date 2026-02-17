import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionistProfile } from '@domain/entities';
import { INutritionistProfileRepository } from '@application/ports/repositories';
import { NutritionistProfileSchema } from '../entities/nutritionist-profile.schema';

@Injectable()
export class TypeORMNutritionistProfileRepository implements INutritionistProfileRepository {
  constructor(
    @InjectRepository(NutritionistProfileSchema)
    private readonly repository: Repository<NutritionistProfileSchema>,
  ) {}

  async save(profile: NutritionistProfile): Promise<NutritionistProfile> {
    const schema = this.toSchema(profile);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findByUserId(userId: string): Promise<NutritionistProfile | null> {
    const schema = await this.repository.findOne({ where: { userId } });
    return schema ? this.toDomain(schema) : null;
  }

  async update(profile: NutritionistProfile): Promise<NutritionistProfile> {
    const schema = this.toSchema(profile);
    await this.repository.save(schema);
    return profile;
  }

  private toSchema(profile: NutritionistProfile): NutritionistProfileSchema {
    const schema = new NutritionistProfileSchema();
    schema.userId = profile.userId;
    schema.crn = profile.crn;
    schema.crnState = profile.crnState;
    schema.fullName = profile.fullName;
    schema.bio = profile.bio;
    schema.specialties = profile.specialties;
    schema.isVerified = profile.isVerified;
    schema.activeClientsCount = profile.activeClientsCount;
    schema.createdAt = profile.createdAt;
    schema.updatedAt = profile.updatedAt;
    return schema;
  }

  private toDomain(schema: NutritionistProfileSchema): NutritionistProfile {
    return NutritionistProfile.reconstitute({
      userId: schema.userId,
      crn: schema.crn,
      crnState: schema.crnState,
      fullName: schema.fullName,
      bio: schema.bio,
      specialties: schema.specialties || [],
      isVerified: schema.isVerified,
      activeClientsCount: schema.activeClientsCount,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
