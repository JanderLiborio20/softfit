import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Meal } from '@domain/entities';
import { IMealRepository } from '@application/ports/repositories';
import { Macros } from '@domain/value-objects';
import { MealSchema } from '../entities/meal.schema';

@Injectable()
export class TypeORMMealRepository implements IMealRepository {
  constructor(
    @InjectRepository(MealSchema)
    private readonly repository: Repository<MealSchema>,
  ) {}

  async save(meal: Meal): Promise<Meal> {
    const schema = this.toSchema(meal);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Meal | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByUserId(userId: string): Promise<Meal[]> {
    const schemas = await this.repository.find({
      where: { userId },
      order: { mealTime: 'DESC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<Meal[]> {
    // Use UTC components to avoid timezone shift when parsing "YYYY-MM-DD" strings
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth();
    const d = date.getUTCDate();
    const startOfDay = new Date(y, m, d, 0, 0, 0, 0);
    const endOfDay = new Date(y, m, d, 23, 59, 59, 999);

    const schemas = await this.repository.find({
      where: {
        userId,
        mealTime: Between(startOfDay, endOfDay),
      },
      order: { mealTime: 'ASC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Meal[]> {
    const schemas = await this.repository.find({
      where: {
        userId,
        mealTime: Between(startDate, endDate),
      },
      order: { mealTime: 'ASC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async update(meal: Meal): Promise<Meal> {
    const schema = this.toSchema(meal);
    await this.repository.save(schema);
    return meal;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getTotalCaloriesByUserAndDate(
    userId: string,
    date: Date,
  ): Promise<number> {
    const meals = await this.findByUserIdAndDate(userId, date);
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  }

  async getTotalMacrosByUserAndDate(
    userId: string,
    date: Date,
  ): Promise<{ carbs: number; protein: number; fat: number }> {
    const meals = await this.findByUserIdAndDate(userId, date);
    return meals.reduce(
      (acc, meal) => ({
        carbs: acc.carbs + meal.macros.carbs,
        protein: acc.protein + meal.macros.protein,
        fat: acc.fat + meal.macros.fat,
      }),
      { carbs: 0, protein: 0, fat: 0 },
    );
  }

  private toSchema(meal: Meal): MealSchema {
    const schema = new MealSchema();
    schema.id = meal.id;
    schema.userId = meal.userId;
    schema.name = meal.name;
    schema.imageUrl = meal.imageUrl;
    schema.audioUrl = meal.audioUrl;
    schema.foods = meal.foods;
    schema.calories = meal.calories;
    schema.macrosCarbs = meal.macros.carbs;
    schema.macrosProtein = meal.macros.protein;
    schema.macrosFat = meal.macros.fat;
    schema.mealTime = meal.mealTime;
    schema.confidence = meal.confidence;
    schema.createdAt = meal.createdAt;
    schema.updatedAt = meal.updatedAt;
    return schema;
  }

  private toDomain(schema: MealSchema): Meal {
    return Meal.reconstitute({
      id: schema.id,
      userId: schema.userId,
      name: schema.name,
      imageUrl: schema.imageUrl,
      audioUrl: schema.audioUrl,
      foods: schema.foods,
      calories: schema.calories,
      macros: new Macros(
        schema.macrosCarbs,
        schema.macrosProtein,
        schema.macrosFat,
      ),
      mealTime: schema.mealTime,
      confidence: schema.confidence,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
