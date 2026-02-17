import { DomainException } from '../exceptions/domain.exception';
import { v4 as uuidv4 } from 'uuid';

/**
 * Interface para uma refeição do plano alimentar
 */
export interface PlannedMeal {
  name: string; // Ex: "Café da Manhã"
  time: string; // Ex: "08:00"
  foods: string[]; // Lista de alimentos
  portions: string[]; // Lista de porções correspondentes
  observations?: string;
}

/**
 * Entidade de Domínio - NutritionPlan
 * Representa um plano alimentar criado por um nutricionista para um cliente
 */
export class NutritionPlan {
  private constructor(
    public readonly id: string,
    public readonly nutritionistId: string,
    public readonly clientId: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly plannedMeals: PlannedMeal[],
    public readonly generalGuidelines: string | null,
    public readonly durationDays: number | null,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new DomainException('Título do plano alimentar é obrigatório');
    }

    if (this.title.length > 200) {
      throw new DomainException('Título muito longo (máximo 200 caracteres)');
    }

    if (this.description && this.description.length > 1000) {
      throw new DomainException('Descrição muito longa (máximo 1000 caracteres)');
    }

    if (this.plannedMeals.length === 0) {
      throw new DomainException('Plano alimentar deve ter pelo menos uma refeição');
    }

    if (this.plannedMeals.length > 10) {
      throw new DomainException('Plano alimentar não pode ter mais de 10 refeições');
    }

    if (this.durationDays && (this.durationDays < 1 || this.durationDays > 365)) {
      throw new DomainException('Duração deve estar entre 1 e 365 dias');
    }

    // Validar cada refeição planejada
    this.plannedMeals.forEach((meal, index) => {
      if (!meal.name || meal.name.trim().length === 0) {
        throw new DomainException(`Refeição ${index + 1} deve ter um nome`);
      }

      if (meal.foods.length === 0) {
        throw new DomainException(`Refeição ${index + 1} deve ter pelo menos um alimento`);
      }

      if (meal.foods.length !== meal.portions.length) {
        throw new DomainException(`Refeição ${index + 1}: número de alimentos e porções deve ser igual`);
      }
    });
  }

  /**
   * Factory method para criar novo plano alimentar
   */
  static create(data: {
    nutritionistId: string;
    clientId: string;
    title: string;
    description?: string;
    plannedMeals: PlannedMeal[];
    generalGuidelines?: string;
    durationDays?: number;
    startDate?: Date;
  }): NutritionPlan {
    const startDate = data.startDate || new Date();
    const endDate = data.durationDays
      ? new Date(startDate.getTime() + data.durationDays * 24 * 60 * 60 * 1000)
      : null;

    return new NutritionPlan(
      uuidv4(),
      data.nutritionistId,
      data.clientId,
      data.title,
      data.description || null,
      data.plannedMeals,
      data.generalGuidelines || null,
      data.durationDays || null,
      startDate,
      endDate,
      true,
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory method para reconstituir plano existente
   */
  static reconstitute(data: {
    id: string;
    nutritionistId: string;
    clientId: string;
    title: string;
    description: string | null;
    plannedMeals: PlannedMeal[];
    generalGuidelines: string | null;
    durationDays: number | null;
    startDate: Date;
    endDate: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): NutritionPlan {
    return new NutritionPlan(
      data.id,
      data.nutritionistId,
      data.clientId,
      data.title,
      data.description,
      data.plannedMeals,
      data.generalGuidelines,
      data.durationDays,
      data.startDate,
      data.endDate,
      data.isActive,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * Verifica se o plano está expirado
   */
  isExpired(): boolean {
    if (!this.endDate) {
      return false; // Planos sem data de término nunca expiram
    }

    return new Date() > this.endDate;
  }

  /**
   * RN009 - Desativa o plano alimentar
   */
  deactivate(): NutritionPlan {
    return new NutritionPlan(
      this.id,
      this.nutritionistId,
      this.clientId,
      this.title,
      this.description,
      this.plannedMeals,
      this.generalGuidelines,
      this.durationDays,
      this.startDate,
      this.endDate,
      false,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Ativa o plano alimentar
   */
  activate(): NutritionPlan {
    return new NutritionPlan(
      this.id,
      this.nutritionistId,
      this.clientId,
      this.title,
      this.description,
      this.plannedMeals,
      this.generalGuidelines,
      this.durationDays,
      this.startDate,
      this.endDate,
      true,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Calcula quantos dias restam do plano
   */
  getDaysRemaining(): number | null {
    if (!this.endDate) {
      return null;
    }

    const now = new Date();
    const diff = this.endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
