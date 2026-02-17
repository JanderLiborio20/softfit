import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@domain/entities';
import { IUserRepository } from '@application/ports/repositories';
import { UserSchema } from '../entities/user.schema';

/**
 * Implementação TypeORM do repositório de usuários
 * Adapter que implementa o Port IUserRepository
 */
@Injectable()
export class TypeORMUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  /**
   * Salva um novo usuário
   */
  async save(user: User): Promise<User> {
    const schema = this.toSchema(user);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  /**
   * Busca usuário por ID
   */
  async findById(id: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  /**
   * Busca usuário por email
   */
  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { email } });
    return schema ? this.toDomain(schema) : null;
  }

  /**
   * Atualiza um usuário existente
   */
  async update(user: User): Promise<User> {
    const schema = this.toSchema(user);
    await this.repository.save(schema);
    return user;
  }

  /**
   * Deleta um usuário
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Verifica se um email já está em uso
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  /**
   * Converte Domain Entity para TypeORM Schema
   */
  private toSchema(user: User): UserSchema {
    const schema = new UserSchema();
    schema.id = user.id;
    schema.email = user.getEmail();
    schema.passwordHash = user.passwordHash;
    schema.name = user.name;
    schema.role = user.role;
    schema.createdAt = user.createdAt;
    schema.updatedAt = user.updatedAt;
    return schema;
  }

  /**
   * Converte TypeORM Schema para Domain Entity
   */
  private toDomain(schema: UserSchema): User {
    return User.reconstitute({
      id: schema.id,
      email: schema.email,
      passwordHash: schema.passwordHash,
      name: schema.name,
      role: schema.role,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
