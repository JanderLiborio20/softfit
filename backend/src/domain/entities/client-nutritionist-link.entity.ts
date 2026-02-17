import { DomainException } from '../exceptions/domain.exception';
import { BusinessRuleException } from '../exceptions/business-rule.exception';
import { LinkStatus } from '../enums/link-status.enum';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidade de Domínio - ClientNutritionistLink
 * Representa o vínculo entre um cliente e um nutricionista
 */
export class ClientNutritionistLink {
  private constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly nutritionistId: string,
    public readonly status: LinkStatus,
    public readonly requestedAt: Date,
    public readonly respondedAt: Date | null,
    public readonly endedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.clientId || !this.nutritionistId) {
      throw new DomainException('Cliente e nutricionista são obrigatórios');
    }

    if (this.clientId === this.nutritionistId) {
      throw new DomainException('Cliente e nutricionista não podem ser o mesmo usuário');
    }
  }

  /**
   * Factory method para criar nova solicitação de vínculo
   */
  static createRequest(data: {
    clientId: string;
    nutritionistId: string;
  }): ClientNutritionistLink {
    return new ClientNutritionistLink(
      uuidv4(),
      data.clientId,
      data.nutritionistId,
      LinkStatus.PENDING,
      new Date(),
      null,
      null,
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory method para reconstituir vínculo existente
   */
  static reconstitute(data: {
    id: string;
    clientId: string;
    nutritionistId: string;
    status: LinkStatus;
    requestedAt: Date;
    respondedAt: Date | null;
    endedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): ClientNutritionistLink {
    return new ClientNutritionistLink(
      data.id,
      data.clientId,
      data.nutritionistId,
      data.status,
      data.requestedAt,
      data.respondedAt,
      data.endedAt,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * RN031 - Aceita a solicitação de vínculo
   */
  accept(): ClientNutritionistLink {
    if (this.status !== LinkStatus.PENDING) {
      throw new BusinessRuleException('Apenas solicitações pendentes podem ser aceitas');
    }

    return new ClientNutritionistLink(
      this.id,
      this.clientId,
      this.nutritionistId,
      LinkStatus.ACTIVE,
      this.requestedAt,
      new Date(),
      null,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * RN031 - Rejeita a solicitação de vínculo
   */
  reject(): ClientNutritionistLink {
    if (this.status !== LinkStatus.PENDING) {
      throw new BusinessRuleException('Apenas solicitações pendentes podem ser rejeitadas');
    }

    return new ClientNutritionistLink(
      this.id,
      this.clientId,
      this.nutritionistId,
      LinkStatus.REJECTED,
      this.requestedAt,
      new Date(),
      new Date(),
      this.createdAt,
      new Date(),
    );
  }

  /**
   * RN032 - Encerra o vínculo pelo cliente
   */
  cancelByClient(): ClientNutritionistLink {
    if (this.status !== LinkStatus.ACTIVE && this.status !== LinkStatus.PENDING) {
      throw new BusinessRuleException('Apenas vínculos ativos ou pendentes podem ser cancelados');
    }

    return new ClientNutritionistLink(
      this.id,
      this.clientId,
      this.nutritionistId,
      LinkStatus.CANCELLED_BY_CLIENT,
      this.requestedAt,
      this.respondedAt,
      new Date(),
      this.createdAt,
      new Date(),
    );
  }

  /**
   * RN032 - Encerra o vínculo pelo nutricionista
   */
  cancelByNutritionist(): ClientNutritionistLink {
    if (this.status !== LinkStatus.ACTIVE) {
      throw new BusinessRuleException('Apenas vínculos ativos podem ser cancelados pelo nutricionista');
    }

    return new ClientNutritionistLink(
      this.id,
      this.clientId,
      this.nutritionistId,
      LinkStatus.CANCELLED_BY_NUTRITIONIST,
      this.requestedAt,
      this.respondedAt,
      new Date(),
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Verifica se o vínculo está ativo
   */
  isActive(): boolean {
    return this.status === LinkStatus.ACTIVE;
  }

  /**
   * Verifica se o vínculo está pendente
   */
  isPending(): boolean {
    return this.status === LinkStatus.PENDING;
  }

  /**
   * Verifica se o vínculo foi encerrado
   */
  isEnded(): boolean {
    return [
      LinkStatus.REJECTED,
      LinkStatus.CANCELLED_BY_CLIENT,
      LinkStatus.CANCELLED_BY_NUTRITIONIST,
    ].includes(this.status);
  }
}
