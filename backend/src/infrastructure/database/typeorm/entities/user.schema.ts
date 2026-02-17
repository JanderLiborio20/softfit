import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserRole } from '@domain/enums';

/**
 * Schema TypeORM para a tabela de usuários
 * Representa a estrutura de persistência do User
 * 
 * IMPORTANTE: Separamos Domain Entity (regras de negócio) de TypeORM Entity (persistência)
 */
@Entity('users')
export class UserSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  @Index()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
