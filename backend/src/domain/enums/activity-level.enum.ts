/**
 * Níveis de atividade física do usuário
 * Usado para cálculo do TDEE (Total Daily Energy Expenditure)
 */
export enum ActivityLevel {
  SEDENTARY = 'sedentary', // Pouco ou nenhum exercício
  LIGHTLY_ACTIVE = 'lightly_active', // Exercício leve 1-3 dias/semana
  MODERATELY_ACTIVE = 'moderately_active', // Exercício moderado 3-5 dias/semana
  VERY_ACTIVE = 'very_active', // Exercício pesado 6-7 dias/semana
  EXTREMELY_ACTIVE = 'extremely_active', // Exercício muito pesado ou atleta
}

/**
 * Multiplicadores para cálculo do TDEE baseado no nível de atividade
 * TDEE = TMB × Multiplicador
 */
export const ACTIVITY_LEVEL_MULTIPLIER = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHTLY_ACTIVE]: 1.375,
  [ActivityLevel.MODERATELY_ACTIVE]: 1.55,
  [ActivityLevel.VERY_ACTIVE]: 1.725,
  [ActivityLevel.EXTREMELY_ACTIVE]: 1.9,
};
