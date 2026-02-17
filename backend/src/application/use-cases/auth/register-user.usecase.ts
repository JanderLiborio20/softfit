import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@domain/entities';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@application/ports/repositories';
import { RegisterDto, AuthResponseDto } from '@application/dtos/auth';

/**
 * Use Case: Registrar novo usuário
 * 
 * Responsabilidades:
 * 1. Validar se email já existe
 * 2. Hash da senha
 * 3. Criar entidade User
 * 4. Persistir no banco
 * 5. Gerar JWT token
 */
@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResponseDto> {
    // 1. Verificar se email já existe
    const emailExists = await this.userRepository.emailExists(dto.email);
    if (emailExists) {
      throw new ConflictException('Email já está em uso');
    }

    // 2. Hash da senha
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 3. Criar entidade User (Domain)
    const user = User.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: dto.role,
    });

    // 4. Persistir no banco
    const savedUser = await this.userRepository.save(user);

    // 5. Gerar JWT token
    const payload = {
      sub: savedUser.id,
      email: savedUser.getEmail(),
      role: savedUser.role,
    };
    const accessToken = this.jwtService.sign(payload);

    // 6. Retornar resposta
    return {
      userId: savedUser.id,
      email: savedUser.getEmail(),
      name: savedUser.name,
      role: savedUser.role,
      accessToken,
    };
  }
}
