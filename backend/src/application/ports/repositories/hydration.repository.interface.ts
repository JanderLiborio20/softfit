import { Hydration } from '@domain/entities';

/**
 * Port (Interface) do Repositório de Hidratação
 */
export interface IHydrationRepository {
  /**
   * Salva um novo registro de hidratação
   */
  save(hydration: Hydration): Promise<Hydration>;

  /**
   * Busca registro por ID
   */
  findById(id: string): Promise<Hydration | null>;

  /**
   * Busca registros de um usuário em uma data específica
   */
  findByUserIdAndDate(userId: string, date: Date): Promise<Hydration[]>;

  /**
   * Deleta um registro de hidratação
   */
  delete(id: string): Promise<void>;

  /**
   * Calcula volume total consumido por um usuário em uma data
   */
  getTotalVolumeByUserAndDate(userId: string, date: Date): Promise<number>;
}
