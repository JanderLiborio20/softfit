import { DomainException } from '../exceptions/domain.exception';
import { WorkoutType } from '../enums/workout-type.enum';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidade de Domínio - Workout
 * Representa uma ficha de treino do usuário
 */
export class Workout {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly type: WorkoutType,
    public readonly description: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new DomainException('Nome da ficha de treino é obrigatório');
    }

    if (this.name.length > 100) {
      throw new DomainException('Nome muito longo (máximo 100 caracteres)');
    }

    if (this.description && this.description.length > 500) {
      throw new DomainException('Descrição muito longa (máximo 500 caracteres)');
    }
  }

  /**
   * Factory method para criar nova ficha de treino
   */
  static create(data: {
    userId: string;
    name: string;
    type: WorkoutType;
    description?: string;
  }): Workout {
    return new Workout(
      uuidv4(),
      data.userId,
      data.name,
      data.type,
      data.description || null,
      true,
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory method para reconstituir ficha existente
   */
  static reconstitute(data: {
    id: string;
    userId: string;
    name: string;
    type: WorkoutType;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Workout {
    return new Workout(
      data.id,
      data.userId,
      data.name,
      data.type,
      data.description,
      data.isActive,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * Ativa a ficha de treino
   */
  activate(): Workout {
    return new Workout(
      this.id,
      this.userId,
      this.name,
      this.type,
      this.description,
      true,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Desativa a ficha de treino
   */
  deactivate(): Workout {
    return new Workout(
      this.id,
      this.userId,
      this.name,
      this.type,
      this.description,
      false,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Atualiza informações da ficha
   */
  update(data: {
    name?: string;
    description?: string;
  }): Workout {
    return new Workout(
      this.id,
      this.userId,
      data.name !== undefined ? data.name : this.name,
      this.type,
      data.description !== undefined ? data.description : this.description,
      this.isActive,
      this.createdAt,
      new Date(),
    );
  }
}
