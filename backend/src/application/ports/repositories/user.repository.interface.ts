import { User } from '@domain/entities';

/**
 * Port (Interface) do Repositório de Usuários
 * Define o contrato que implementações concretas devem seguir
 * 
 * Princípio: Application define a interface, Infrastructure implementa
 */
export interface IUserRepository {
  /**
   * Salva um novo usuário
   */
  save(user: User): Promise<User>;

  /**
   * Busca usuário por ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca usuário por email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Atualiza um usuário existente
   */
  update(user: User): Promise<User>;

  /**
   * Deleta um usuário
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se um email já está em uso
   */
  emailExists(email: string): Promise<boolean>;
}
