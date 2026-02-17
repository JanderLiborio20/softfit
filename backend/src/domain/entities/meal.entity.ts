import { Macros } from '../value-objects/macros.vo';
import { DomainException } from '../exceptions/domain.exception';
import { BusinessRuleException } from '../exceptions/business-rule.exception';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidade de Domínio - Meal (Refeição)
 * Representa uma refeição registrada pelo usuário
 */
export class Meal {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly imageUrl: string | null,
    public readonly audioUrl: string | null,
    public readonly foods: string[],
    public readonly calories: number,
    public readonly macros: Macros,
    public readonly mealTime: Date,
    public readonly confidence: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new DomainException('Nome da refeição é obrigatório');
    }

    if (this.calories < 0) {
      throw new DomainException('Calorias não podem ser negativas');
    }

    if (this.calories > 5000) {
      throw new DomainException('Calorias muito altas para uma refeição');
    }

    if (this.confidence < 0 || this.confidence > 100) {
      throw new DomainException('Confiança deve estar entre 0 e 100');
    }

    if (!this.imageUrl && !this.audioUrl) {
      throw new DomainException('Refeição deve ter imagem ou áudio');
    }
  }

  /**
   * Factory method para criar nova refeição
   */
  static create(data: {
    userId: string;
    name: string;
    imageUrl?: string;
    audioUrl?: string;
    foods: string[];
    calories: number;
    macros: Macros;
    mealTime?: Date;
    confidence?: number;
  }): Meal {
    return new Meal(
      uuidv4(),
      data.userId,
      data.name,
      data.imageUrl || null,
      data.audioUrl || null,
      data.foods,
      data.calories,
      data.macros,
      data.mealTime || new Date(),
      data.confidence || 0,
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory method para reconstituir refeição existente
   */
  static reconstitute(data: {
    id: string;
    userId: string;
    name: string;
    imageUrl: string | null;
    audioUrl: string | null;
    foods: string[];
    calories: number;
    macros: Macros;
    mealTime: Date;
    confidence: number;
    createdAt: Date;
    updatedAt: Date;
  }): Meal {
    return new Meal(
      data.id,
      data.userId,
      data.name,
      data.imageUrl,
      data.audioUrl,
      data.foods,
      data.calories,
      data.macros,
      data.mealTime,
      data.confidence,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * Regra de Negócio RN008: Verifica se a refeição pode ser editada
   * Refeições com mais de 7 dias não podem ser editadas
   */
  canBeEdited(): boolean {
    const now = new Date();
    const daysDifference = Math.floor(
      (now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysDifference <= 7;
  }

  /**
   * Verifica se a refeição foi criada a partir de foto
   */
  isFromPhoto(): boolean {
    return this.imageUrl !== null;
  }

  /**
   * Verifica se a refeição foi criada a partir de áudio
   */
  isFromAudio(): boolean {
    return this.audioUrl !== null;
  }

  /**
   * Retorna a idade da refeição em dias
   */
  getAgeInDays(): number {
    const now = new Date();
    return Math.floor((now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  }
}
