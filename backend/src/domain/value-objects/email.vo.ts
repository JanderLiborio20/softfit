import { DomainException } from '../exceptions/domain.exception';

/**
 * Value Object para Email
 * Garante que o email seja válido e normalizado
 */
export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.validate(email);
    this.value = this.normalize(email);
  }

  private validate(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new DomainException('Email não pode ser vazio');
    }

    // Regex simples para validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new DomainException('Email inválido');
    }

    if (email.length > 255) {
      throw new DomainException('Email muito longo (máximo 255 caracteres)');
    }
  }

  private normalize(email: string): string {
    return email.trim().toLowerCase();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
