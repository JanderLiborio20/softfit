import { DomainException } from './domain.exception';

/**
 * Exceção para violação de regras de negócio específicas
 * Ex: "Não pode editar refeição com mais de 7 dias"
 */
export class BusinessRuleException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleException';
  }
}
