import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@domain/enums';

/**
 * DTO de resposta de autenticação (login/register)
 */
export class AuthResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do usuário',
  })
  userId: string;

  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do usuário',
  })
  name: string;

  @ApiProperty({
    example: 'client',
    description: 'Papel do usuário',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT de acesso',
  })
  accessToken: string;
}
