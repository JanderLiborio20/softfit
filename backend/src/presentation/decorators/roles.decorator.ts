import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@domain/enums';

/**
 * Decorator para definir roles permitidas em uma rota
 * Uso: @Roles(UserRole.CLIENT, UserRole.NUTRITIONIST)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
