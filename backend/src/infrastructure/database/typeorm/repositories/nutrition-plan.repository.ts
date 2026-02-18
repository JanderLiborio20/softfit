import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionPlan } from '@domain/entities';
import { INutritionPlanRepository } from '@application/ports/repositories';
import { NutritionPlanSchema } from '../entities/nutrition-plan.schema';

@Injectable()
export class TypeORMNutritionPlanRepository implements INutritionPlanRepository {
  constructor(
    @InjectRepository(NutritionPlanSchema)
    private readonly repository: Repository<NutritionPlanSchema>,
  ) {}

  async save(plan: NutritionPlan): Promise<NutritionPlan> {
    const schema = this.toSchema(plan);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<NutritionPlan | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByClientId(clientId: string): Promise<NutritionPlan[]> {
    const schemas = await this.repository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async findActiveByClientId(clientId: string): Promise<NutritionPlan | null> {
    const schema = await this.repository.findOne({
      where: { clientId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return schema ? this.toDomain(schema) : null;
  }

  async findByNutritionistId(nutritionistId: string): Promise<NutritionPlan[]> {
    const schemas = await this.repository.find({
      where: { nutritionistId },
      order: { createdAt: 'DESC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async update(plan: NutritionPlan): Promise<NutritionPlan> {
    const schema = this.toSchema(plan);
    await this.repository.save(schema);
    return plan;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toSchema(plan: NutritionPlan): NutritionPlanSchema {
    const schema = new NutritionPlanSchema();
    schema.id = plan.id;
    schema.nutritionistId = plan.nutritionistId;
    schema.clientId = plan.clientId;
    schema.title = plan.title;
    schema.description = plan.description;
    schema.plannedMeals = plan.plannedMeals;
    schema.generalGuidelines = plan.generalGuidelines;
    schema.durationDays = plan.durationDays;
    schema.startDate = plan.startDate;
    schema.endDate = plan.endDate;
    schema.isActive = plan.isActive;
    schema.createdAt = plan.createdAt;
    schema.updatedAt = plan.updatedAt;
    return schema;
  }

  private toDomain(schema: NutritionPlanSchema): NutritionPlan {
    return NutritionPlan.reconstitute({
      id: schema.id,
      nutritionistId: schema.nutritionistId,
      clientId: schema.clientId,
      title: schema.title,
      description: schema.description,
      plannedMeals: schema.plannedMeals,
      generalGuidelines: schema.generalGuidelines,
      durationDays: schema.durationDays,
      startDate: schema.startDate,
      endDate: schema.endDate,
      isActive: schema.isActive,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
