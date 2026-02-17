import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@presentation/decorators/current-user.decorator';

/**
 * Estratégia JWT para autenticação
 * Valida e extrai dados do token JWT
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
