import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Hydration } from '@domain/entities';
import { DrinkType } from '@domain/enums';
import { IHydrationRepository } from '@application/ports/repositories';
import { HydrationSchema } from '../entities/hydration.schema';

@Injectable()
export class TypeORMHydrationRepository implements IHydrationRepository {
  constructor(
    @InjectRepository(HydrationSchema)
    private readonly repository: Repository<HydrationSchema>,
  ) {}

  async save(hydration: Hydration): Promise<Hydration> {
    const schema = this.toSchema(hydration);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Hydration | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<Hydration[]> {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth();
    const d = date.getUTCDate();
    const startOfDay = new Date(y, m, d, 0, 0, 0, 0);
    const endOfDay = new Date(y, m, d, 23, 59, 59, 999);

    const schemas = await this.repository.find({
      where: {
        userId,
        timestamp: Between(startOfDay, endOfDay),
      },
      order: { timestamp: 'ASC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getTotalVolumeByUserAndDate(
    userId: string,
    date: Date,
  ): Promise<number> {
    const hydrations = await this.findByUserIdAndDate(userId, date);
    return hydrations.reduce((sum, h) => sum + h.volumeMl, 0);
  }

  private toSchema(hydration: Hydration): HydrationSchema {
    const schema = new HydrationSchema();
    schema.id = hydration.id;
    schema.userId = hydration.userId;
    schema.volumeMl = hydration.volumeMl;
    schema.drinkType = hydration.drinkType;
    schema.timestamp = hydration.timestamp;
    schema.createdAt = hydration.createdAt;
    schema.updatedAt = hydration.updatedAt;
    return schema;
  }

  private toDomain(schema: HydrationSchema): Hydration {
    return Hydration.reconstitute({
      id: schema.id,
      userId: schema.userId,
      volumeMl: schema.volumeMl,
      drinkType: schema.drinkType as DrinkType,
      timestamp: schema.timestamp,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
