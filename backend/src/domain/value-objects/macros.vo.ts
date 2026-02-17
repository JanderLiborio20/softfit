import { DomainException } from '../exceptions/domain.exception';

/**
 * Value Object para Macronutrientes
 * Representa carboidratos, proteínas e gorduras em gramas
 */
export class Macros {
  constructor(
    public readonly carbs: number,
    public readonly protein: number,
    public readonly fat: number,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.carbs < 0 || this.protein < 0 || this.fat < 0) {
      throw new DomainException('Macronutrientes não podem ser negativos');
    }

    if (this.carbs > 1000 || this.protein > 500 || this.fat > 500) {
      throw new DomainException('Valores de macronutrientes muito altos');
    }
  }

  /**
   * Calcula as calorias totais baseado nos macros
   * Carbs: 4 kcal/g, Protein: 4 kcal/g, Fat: 9 kcal/g
   */
  getTotalCalories(): number {
    return this.carbs * 4 + this.protein * 4 + this.fat * 9;
  }

  /**
   * Cria um objeto Macros a partir de calorias totais e percentuais
   */
  static fromCaloriesAndPercentages(
    calories: number,
    carbsPercentage: number,
    proteinPercentage: number,
    fatPercentage: number,
  ): Macros {
    // Validar que percentuais somam 100%
    const total = carbsPercentage + proteinPercentage + fatPercentage;
    if (Math.abs(total - 100) > 0.01) {
      throw new DomainException('Percentuais de macros devem somar 100%');
    }

    const carbCalories = (calories * carbsPercentage) / 100;
    const proteinCalories = (calories * proteinPercentage) / 100;
    const fatCalories = (calories * fatPercentage) / 100;

    return new Macros(
      Math.round(carbCalories / 4),
      Math.round(proteinCalories / 4),
      Math.round(fatCalories / 9),
    );
  }

  equals(other: Macros): boolean {
    if (!other) return false;
    return (
      this.carbs === other.carbs && this.protein === other.protein && this.fat === other.fat
    );
  }

  toJSON() {
    return {
      carbs: this.carbs,
      protein: this.protein,
      fat: this.fat,
      totalCalories: this.getTotalCalories(),
    };
  }
}
