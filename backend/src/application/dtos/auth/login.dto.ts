import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para login de usuário
 */
export class LoginDto {
  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
