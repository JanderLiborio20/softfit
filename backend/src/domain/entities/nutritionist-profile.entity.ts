import { DomainException } from '../exceptions/domain.exception';
import { BusinessRuleException } from '../exceptions/business-rule.exception';

/**
 * Entidade de Domínio - NutritionistProfile
 * Representa o perfil profissional de um nutricionista
 */
export class NutritionistProfile {
  private constructor(
    public readonly userId: string,
    public readonly crn: string, // Conselho Regional de Nutricionistas
    public readonly crnState: string, // Estado do registro (ex: SP, RJ, MG)
    public readonly fullName: string,
    public readonly bio: string | null,
    public readonly specialties: string[],
    public readonly isVerified: boolean,
    public readonly activeClientsCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    // Validação de CRN (formato: números)
    const crnRegex = /^\d{4,6}$/;
    if (!crnRegex.test(this.crn)) {
      throw new DomainException('CRN inválido (deve conter 4-6 dígitos)');
    }

    // Validação de estado
    const validStates = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
    ];
    if (!validStates.includes(this.crnState)) {
      throw new DomainException('Estado inválido');
    }

    // Validação de nome completo
    if (!this.fullName || this.fullName.trim().length < 5) {
      throw new DomainException('Nome completo deve ter pelo menos 5 caracteres');
    }

    // Validação de bio
    if (this.bio && this.bio.length > 500) {
      throw new DomainException('Biografia muito longa (máximo 500 caracteres)');
    }
  }

  /**
   * Factory method para criar novo perfil de nutricionista
   */
  static create(data: {
    userId: string;
    crn: string;
    crnState: string;
    fullName: string;
    bio?: string;
    specialties?: string[];
  }): NutritionistProfile {
    return new NutritionistProfile(
      data.userId,
      data.crn,
      data.crnState.toUpperCase(),
      data.fullName,
      data.bio || null,
      data.specialties || [],
      false, // Não verificado inicialmente
      0, // Sem clientes inicialmente
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory method para reconstituir perfil existente
   */
  static reconstitute(data: {
    userId: string;
    crn: string;
    crnState: string;
    fullName: string;
    bio: string | null;
    specialties: string[];
    isVerified: boolean;
    activeClientsCount: number;
    createdAt: Date;
    updatedAt: Date;
  }): NutritionistProfile {
    return new NutritionistProfile(
      data.userId,
      data.crn,
      data.crnState,
      data.fullName,
      data.bio,
      data.specialties,
      data.isVerified,
      data.activeClientsCount,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * RN004 - Verifica se o nutricionista pode aceitar mais clientes
   * Limite máximo de 100 clientes ativos
   */
  canAcceptMoreClients(): boolean {
    return this.activeClientsCount < 100;
  }

  /**
   * RN006 - Verifica se o nutricionista está verificado
   */
  isReadyToAcceptClients(): boolean {
    return this.isVerified;
  }

  /**
   * Marca o nutricionista como verificado
   */
  verify(): NutritionistProfile {
    return new NutritionistProfile(
      this.userId,
      this.crn,
      this.crnState,
      this.fullName,
      this.bio,
      this.specialties,
      true,
      this.activeClientsCount,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Incrementa o contador de clientes ativos
   */
  incrementActiveClients(): NutritionistProfile {
    if (!this.canAcceptMoreClients()) {
      throw new BusinessRuleException('Limite de clientes ativos atingido (100)');
    }

    return new NutritionistProfile(
      this.userId,
      this.crn,
      this.crnState,
      this.fullName,
      this.bio,
      this.specialties,
      this.isVerified,
      this.activeClientsCount + 1,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Decrementa o contador de clientes ativos
   */
  decrementActiveClients(): NutritionistProfile {
    const newCount = Math.max(0, this.activeClientsCount - 1);

    return new NutritionistProfile(
      this.userId,
      this.crn,
      this.crnState,
      this.fullName,
      this.bio,
      this.specialties,
      this.isVerified,
      newCount,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Atualiza perfil profissional
   */
  updateProfile(data: {
    bio?: string;
    specialties?: string[];
  }): NutritionistProfile {
    return new NutritionistProfile(
      this.userId,
      this.crn,
      this.crnState,
      this.fullName,
      data.bio !== undefined ? data.bio : this.bio,
      data.specialties !== undefined ? data.specialties : this.specialties,
      this.isVerified,
      this.activeClientsCount,
      this.createdAt,
      new Date(),
    );
  }
}
