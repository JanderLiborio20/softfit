import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para marcar rotas como públicas (sem autenticação)
 * Uso: @Public()
 */
export const Public = () => SetMetadata('isPublic', true);
