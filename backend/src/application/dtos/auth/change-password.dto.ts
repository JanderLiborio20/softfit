import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO para troca de senha
 */
export class ChangePasswordDto {
  @ApiProperty({
    example: 'senhaAtual123',
    description: 'Senha atual do usuário',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    example: 'novaSenha456',
    description: 'Nova senha (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
