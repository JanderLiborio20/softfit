/**
 * Objetivos possíveis do usuário
 * Usado para cálculo automático de metas nutricionais
 */
export enum UserGoal {
  LOSE_WEIGHT = 'lose_weight',
  GAIN_WEIGHT = 'gain_weight',
  MAINTAIN_WEIGHT = 'maintain_weight',
  IMPROVE_HEALTH = 'improve_health',
}

/**
 * Ajustes calóricos baseados no objetivo
 */
export const GOAL_CALORIE_ADJUSTMENT = {
  [UserGoal.LOSE_WEIGHT]: -500, // Déficit de 500 kcal
  [UserGoal.GAIN_WEIGHT]: 300, // Superávit de 300 kcal
  [UserGoal.MAINTAIN_WEIGHT]: 0, // Sem ajuste
  [UserGoal.IMPROVE_HEALTH]: 0, // Sem ajuste
};
