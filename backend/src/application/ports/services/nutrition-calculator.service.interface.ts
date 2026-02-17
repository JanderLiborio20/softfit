import { Gender, ActivityLevel, UserGoal } from '@domain/enums';
import { Macros } from '@domain/value-objects';

/**
 * Metas nutricionais calculadas
 */
export interface NutritionalGoals {
  calories: number;
  macros: Macros;
}

/**
 * Dados do usuário para cálculo de metas
 */
export interface UserMetricsData {
  dateOfBirth: Date;
  gender: Gender;
  height: number; // em cm
  weight: number; // em kg
  activityLevel: ActivityLevel;
  goal: UserGoal;
}

/**
 * Port (Interface) do Serviço de Cálculo Nutricional
 * Define contrato para cálculos de metas nutricionais
 */
export interface INutritionCalculatorService {
  /**
   * Calcula as metas nutricionais baseado nos dados do usuário
   * Usa fórmulas Mifflin-St Jeor para TMB e multiplica pelo fator de atividade
   * @param userData Dados do usuário
   * @returns Metas calculadas (calorias e macros)
   */
  calculateGoals(userData: UserMetricsData): NutritionalGoals;

  /**
   * Calcula apenas a Taxa Metabólica Basal (TMB)
   * @param userData Dados do usuário
   * @returns TMB em kcal
   */
  calculateBMR(userData: UserMetricsData): number;

  /**
   * Calcula o TDEE (Total Daily Energy Expenditure)
   * @param userData Dados do usuário
   * @returns TDEE em kcal
   */
  calculateTDEE(userData: UserMetricsData): number;

  /**
   * Calcula a idade baseado na data de nascimento
   * @param dateOfBirth Data de nascimento
   * @returns Idade em anos
   */
  calculateAge(dateOfBirth: Date): number;

  /**
   * Calcula IMC (Índice de Massa Corporal)
   * @param weight Peso em kg
   * @param height Altura em cm
   * @returns IMC
   */
  calculateBMI(weight: number, height: number): number;
}
