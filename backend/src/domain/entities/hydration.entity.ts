import { DomainException } from '../exceptions/domain.exception';
import { DrinkType } from '../enums/drink-type.enum';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidade de Domínio - Hydration (Registro de Hidratação)
 * Representa um registro de consumo de líquido pelo usuário
 */
export class Hydration {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly volumeMl: number,
    public readonly drinkType: DrinkType,
    public readonly timestamp: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.volumeMl <= 0) {
      throw new DomainException('Volume deve ser maior que zero');
    }

    if (this.volumeMl > 5000) {
      throw new DomainException('Volume não pode exceder 5000ml');
    }

    if (!Object.values(DrinkType).includes(this.drinkType)) {
      throw new DomainException('Tipo de bebida inválido');
    }
  }

  /**
   * Factory method para criar novo registro de hidratação
   */
  static create(data: {
    userId: string;
    volumeMl: number;
    drinkType: DrinkType;
    timestamp?: Date;
  }): Hydration {
    return new Hydration(
      uuidv4(),
      data.userId,
      data.volumeMl,
      data.drinkType,
      data.timestamp || new Date(),
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory method para reconstituir registro existente
   */
  static reconstitute(data: {
    id: string;
    userId: string;
    volumeMl: number;
    drinkType: DrinkType;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
  }): Hydration {
    return new Hydration(
      data.id,
      data.userId,
      data.volumeMl,
      data.drinkType,
      data.timestamp,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * Retorna o ícone correspondente ao tipo de bebida
   */
  getDrinkIcon(): string {
    const icons: Record<DrinkType, string> = {
      [DrinkType.WATER]: '💧',
      [DrinkType.COFFEE]: '☕',
      [DrinkType.JUICE]: '🧃',
      [DrinkType.TEA]: '🍵',
      [DrinkType.MILK]: '🥛',
      [DrinkType.OTHER]: '🥤',
    };
    return icons[this.drinkType];
  }
}
