/**
 * Exceção base para erros de domínio
 * Representa violações de regras de negócio
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
    Error.captureStackTrace(this, this.constructor);
  }
}
