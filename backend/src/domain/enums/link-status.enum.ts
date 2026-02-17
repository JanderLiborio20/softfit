/**
 * Status do vínculo entre cliente e nutricionista
 */
export enum LinkStatus {
  PENDING = 'pending', // Aguardando aceite do nutricionista
  ACTIVE = 'active', // Vínculo ativo
  REJECTED = 'rejected', // Rejeitado pelo nutricionista
  CANCELLED_BY_CLIENT = 'cancelled_by_client', // Cancelado pelo cliente
  CANCELLED_BY_NUTRITIONIST = 'cancelled_by_nutritionist', // Cancelado pelo nutricionista
}
