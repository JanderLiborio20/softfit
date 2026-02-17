import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '@domain/enums';

/**
 * DTO para registro de novo usuário
 */
export class RegisterDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha (mínimo 8 caracteres)',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'client',
    description: 'Tipo de usuário',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
