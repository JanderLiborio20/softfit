import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Payload do JWT token
 */
export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
}

/**
 * Decorator para obter o usuário autenticado da requisição
 * Uso: @CurrentUser() user: JwtPayload
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    return data ? user[data] : user;
  },
);
