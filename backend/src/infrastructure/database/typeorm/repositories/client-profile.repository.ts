import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProfile } from '@domain/entities';
import { IClientProfileRepository } from '@application/ports/repositories';
import { Macros } from '@domain/value-objects';
import { ClientProfileSchema } from '../entities/client-profile.schema';

@Injectable()
export class TypeORMClientProfileRepository implements IClientProfileRepository {
  constructor(
    @InjectRepository(ClientProfileSchema)
    private readonly repository: Repository<ClientProfileSchema>,
  ) {}

  async save(profile: ClientProfile): Promise<ClientProfile> {
    const schema = this.toSchema(profile);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findByUserId(userId: string): Promise<ClientProfile | null> {
    const schema = await this.repository.findOne({ where: { userId } });
    return schema ? this.toDomain(schema) : null;
  }

  async update(profile: ClientProfile): Promise<ClientProfile> {
    const schema = this.toSchema(profile);
    await this.repository.save(schema);
    return profile;
  }

  private toSchema(profile: ClientProfile): ClientProfileSchema {
    const schema = new ClientProfileSchema();
    schema.userId = profile.userId;
    schema.dateOfBirth = profile.dateOfBirth;
    schema.gender = profile.gender;
    schema.heightCm = profile.heightCm;
    schema.weightKg = profile.weightKg;
    schema.goal = profile.goal;
    schema.activityLevel = profile.activityLevel;
    schema.dailyCaloriesGoal = profile.dailyCaloriesGoal;
    schema.dailyMacrosCarbs = profile.dailyMacrosGoal.carbs;
    schema.dailyMacrosProtein = profile.dailyMacrosGoal.protein;
    schema.dailyMacrosFat = profile.dailyMacrosGoal.fat;
    schema.isGoalManuallySet = profile.isGoalManuallySet;
    schema.createdAt = profile.createdAt;
    schema.updatedAt = profile.updatedAt;
    return schema;
  }

  private toDomain(schema: ClientProfileSchema): ClientProfile {
    return ClientProfile.reconstitute({
      userId: schema.userId,
      dateOfBirth: new Date(schema.dateOfBirth),
      gender: schema.gender,
      heightCm: Number(schema.heightCm),
      weightKg: Number(schema.weightKg),
      goal: schema.goal,
      activityLevel: schema.activityLevel,
      dailyCaloriesGoal: schema.dailyCaloriesGoal,
      dailyMacrosGoal: new Macros(
        schema.dailyMacrosCarbs,
        schema.dailyMacrosProtein,
        schema.dailyMacrosFat,
      ),
      isGoalManuallySet: schema.isGoalManuallySet,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
