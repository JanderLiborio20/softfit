import { DomainException } from '../exceptions/domain.exception';
import { Gender } from '../enums/gender.enum';
import { UserGoal } from '../enums/user-goal.enum';
import { ActivityLevel } from '../enums/activity-level.enum';
import { Macros } from '../value-objects/macros.vo';

/**
 * Entidade de Domínio - ClientProfile
 * Representa o perfil completo de um cliente com dados de onboarding e metas
 */
export class ClientProfile {
  private constructor(
    public readonly userId: string,
    public readonly dateOfBirth: Date,
    public readonly gender: Gender,
    public readonly heightCm: number,
    public readonly weightKg: number,
    public readonly goal: UserGoal,
    public readonly activityLevel: ActivityLevel,
    public readonly dailyCaloriesGoal: number,
    public readonly dailyMacrosGoal: Macros,
    public readonly isGoalManuallySet: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    // Validação de altura
    if (this.heightCm < 100 || this.heightCm > 250) {
      throw new DomainException('Altura deve estar entre 100cm e 250cm');
    }

    // Validação de peso
    if (this.weightKg < 30 || this.weightKg > 300) {
      throw new DomainException('Peso deve estar entre 30kg e 300kg');
    }

    // Validação de data de nascimento
    const age = this.getAge();
    if (age < 13) {
      throw new DomainException('Usuário deve ter pelo menos 13 anos');
    }
    if (age > 120) {
      throw new DomainException('Data de nascimento inválida');
    }

    // Validação de calorias
    if (this.dailyCaloriesGoal < 800 || this.dailyCaloriesGoal > 5000) {
      throw new DomainException('Meta calórica deve estar entre 800 e 5000 kcal');
    }
  }

  /**
   * Factory method para criar novo perfil de cliente
   */
  static create(data: {
    userId: string;
    dateOfBirth: Date;
    gender: Gender;
    heightCm: number;
    weightKg: number;
    goal: UserGoal;
    activityLevel: ActivityLevel;
    dailyCaloriesGoal: number;
    dailyMacrosGoal: Macros;
    isGoalManuallySet?: boolean;
  }): ClientProfile {
    return new ClientProfile(
      data.userId,
      data.dateOfBirth,
      data.gender,
      data.heightCm,
      data.weightKg,
      data.goal,
      data.activityLevel,
      data.dailyCaloriesGoal,
      data.dailyMacrosGoal,
      data.isGoalManuallySet || false,
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory method para reconstituir perfil existente
   */
  static reconstitute(data: {
    userId: string;
    dateOfBirth: Date;
    gender: Gender;
    heightCm: number;
    weightKg: number;
    goal: UserGoal;
    activityLevel: ActivityLevel;
    dailyCaloriesGoal: number;
    dailyMacrosGoal: Macros;
    isGoalManuallySet: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ClientProfile {
    return new ClientProfile(
      data.userId,
      data.dateOfBirth,
      data.gender,
      data.heightCm,
      data.weightKg,
      data.goal,
      data.activityLevel,
      data.dailyCaloriesGoal,
      data.dailyMacrosGoal,
      data.isGoalManuallySet,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * Calcula a idade do usuário
   */
  getAge(): number {
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Calcula o IMC (Índice de Massa Corporal)
   */
  calculateBMI(): number {
    const heightMeters = this.heightCm / 100;
    return this.weightKg / (heightMeters * heightMeters);
  }

  /**
   * Atualiza peso e recalcula metas se necessário
   */
  updateWeight(newWeightKg: number): ClientProfile {
    if (newWeightKg < 30 || newWeightKg > 300) {
      throw new DomainException('Peso deve estar entre 30kg e 300kg');
    }

    return new ClientProfile(
      this.userId,
      this.dateOfBirth,
      this.gender,
      this.heightCm,
      newWeightKg,
      this.goal,
      this.activityLevel,
      this.dailyCaloriesGoal,
      this.dailyMacrosGoal,
      this.isGoalManuallySet,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Atualiza metas manualmente
   */
  updateGoalsManually(calories: number, macros: Macros): ClientProfile {
    if (calories < 800 || calories > 5000) {
      throw new DomainException('Meta calórica deve estar entre 800 e 5000 kcal');
    }

    return new ClientProfile(
      this.userId,
      this.dateOfBirth,
      this.gender,
      this.heightCm,
      this.weightKg,
      this.goal,
      this.activityLevel,
      calories,
      macros,
      true, // Marca como definido manualmente
      this.createdAt,
      new Date(),
    );
  }
}
