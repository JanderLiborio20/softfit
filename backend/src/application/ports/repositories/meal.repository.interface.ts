import { Meal } from '@domain/entities';

/**
 * Port (Interface) do Repositório de Refeições
 */
export interface IMealRepository {
  /**
   * Salva uma nova refeição
   */
  save(meal: Meal): Promise<Meal>;

  /**
   * Busca refeição por ID
   */
  findById(id: string): Promise<Meal | null>;

  /**
   * Busca todas as refeições de um usuário
   */
  findByUserId(userId: string): Promise<Meal[]>;

  /**
   * Busca refeições de um usuário em uma data específica
   */
  findByUserIdAndDate(userId: string, date: Date): Promise<Meal[]>;

  /**
   * Busca refeições de um usuário em um intervalo de datas
   */
  findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Meal[]>;

  /**
   * Atualiza uma refeição existente
   */
  update(meal: Meal): Promise<Meal>;

  /**
   * Deleta uma refeição
   */
  delete(id: string): Promise<void>;

  /**
   * Calcula total de calorias consumidas por um usuário em uma data
   */
  getTotalCaloriesByUserAndDate(userId: string, date: Date): Promise<number>;

  /**
   * Calcula total de macros consumidos por um usuário em uma data
   */
  getTotalMacrosByUserAndDate(
    userId: string,
    date: Date,
  ): Promise<{ carbs: number; protein: number; fat: number }>;
}
