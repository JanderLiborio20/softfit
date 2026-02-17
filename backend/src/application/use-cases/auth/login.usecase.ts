import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@application/ports/repositories';
import { LoginDto, AuthResponseDto } from '@application/dtos/auth';

/**
 * Use Case: Login de usuário
 * 
 * Responsabilidades:
 * 1. Validar credenciais
 * 2. Gerar JWT token
 * 3. Retornar dados do usuário
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    // 1. Buscar usuário por email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 2. Verificar senha
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 3. Gerar JWT token
    const payload = {
      sub: user.id,
      email: user.getEmail(),
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    // 4. Retornar resposta
    return {
      userId: user.id,
      email: user.getEmail(),
      name: user.name,
      role: user.role,
      accessToken,
    };
  }
}
