import { Email } from '../value-objects/email.vo';
import { UserRole } from '../enums/user-role.enum';
import { DomainException } from '../exceptions/domain.exception';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidade de Domínio - User
 * Representa um usuário no sistema (Cliente ou Nutricionista)
 * 
 * IMPORTANTE: Esta é a entidade de DOMÍNIO, não a entidade do TypeORM
 * Contém apenas regras de negócio, sem detalhes de persistência
 */
export class User {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly passwordHash: string,
    public readonly name: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 2) {
      throw new DomainException('Nome deve ter pelo menos 2 caracteres');
    }

    if (this.name.length > 100) {
      throw new DomainException('Nome muito longo (máximo 100 caracteres)');
    }
  }

  /**
   * Factory method para criar novo usuário
   */
  static create(data: {
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
  }): User {
    return new User(
      uuidv4(),
      new Email(data.email),
      data.passwordHash,
      data.name,
      data.role,
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory method para reconstituir usuário existente (ex: do banco)
   */
  static reconstitute(data: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      data.id,
      new Email(data.email),
      data.passwordHash,
      data.name,
      data.role,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * Verifica se o usuário é um cliente
   */
  isClient(): boolean {
    return this.role === UserRole.CLIENT;
  }

  /**
   * Verifica se o usuário é um nutricionista
   */
  isNutritionist(): boolean {
    return this.role === UserRole.NUTRITIONIST;
  }

  /**
   * Retorna o email como string
   */
  getEmail(): string {
    return this.email.getValue();
  }
}
