import { Injectable, Inject, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@application/ports/repositories';
import { ChangePasswordDto } from '@application/dtos/auth';
import { User } from '@domain/entities';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isCurrentValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);

    const updated = User.reconstitute({
      id: user.id,
      email: user.getEmail(),
      passwordHash: newHash,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: new Date(),
    });

    await this.userRepository.update(updated);
  }
}
