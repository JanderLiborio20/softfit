import { DomainException } from '../exceptions/domain.exception';
import { MuscleGroup } from '../enums/muscle-group.enum';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidade de Domínio - Exercise
 * Representa um exercício dentro de uma ficha de treino
 */
export class Exercise {
  private constructor(
    public readonly id: string,
    public readonly workoutId: string,
    public readonly name: string,
    public readonly muscleGroup: MuscleGroup,
    public readonly sets: number,
    public readonly reps: string, // Pode ser "12" ou "10-12" ou "até falha"
    public readonly restSeconds: number,
    public readonly notes: string | null,
    public readonly order: number, // Ordem do exercício na ficha
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new DomainException('Nome do exercício é obrigatório');
    }

    if (this.sets < 1 || this.sets > 20) {
      throw new DomainException('Número de séries deve estar entre 1 e 20');
    }

    if (!this.reps || this.reps.trim().length === 0) {
      throw new DomainException('Repetições são obrigatórias');
    }

    if (this.restSeconds < 0 || this.restSeconds > 600) {
      throw new DomainException('Descanso deve estar entre 0 e 600 segundos');
    }

    if (this.order < 0) {
      throw new DomainException('Ordem do exercício não pode ser negativa');
    }
  }

  /**
   * Factory method para criar novo exercício
   */
  static create(data: {
    workoutId: string;
    name: string;
    muscleGroup: MuscleGroup;
    sets: number;
    reps: string;
    restSeconds?: number;
    notes?: string;
    order: number;
  }): Exercise {
    return new Exercise(
      uuidv4(),
      data.workoutId,
      data.name,
      data.muscleGroup,
      data.sets,
      data.reps,
      data.restSeconds || 60,
      data.notes || null,
      data.order,
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory method para reconstituir exercício existente
   */
  static reconstitute(data: {
    id: string;
    workoutId: string;
    name: string;
    muscleGroup: MuscleGroup;
    sets: number;
    reps: string;
    restSeconds: number;
    notes: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }): Exercise {
    return new Exercise(
      data.id,
      data.workoutId,
      data.name,
      data.muscleGroup,
      data.sets,
      data.reps,
      data.restSeconds,
      data.notes,
      data.order,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * Atualiza detalhes do exercício
   */
  update(data: {
    name?: string;
    sets?: number;
    reps?: string;
    restSeconds?: number;
    notes?: string;
  }): Exercise {
    return new Exercise(
      this.id,
      this.workoutId,
      data.name !== undefined ? data.name : this.name,
      this.muscleGroup,
      data.sets !== undefined ? data.sets : this.sets,
      data.reps !== undefined ? data.reps : this.reps,
      data.restSeconds !== undefined ? data.restSeconds : this.restSeconds,
      data.notes !== undefined ? data.notes : this.notes,
      this.order,
      this.createdAt,
      new Date(),
    );
  }
}
