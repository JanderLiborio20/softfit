import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto, LoginDto, AuthResponseDto } from '@application/dtos/auth';
import { RegisterUserUseCase } from '@application/use-cases/auth/register-user.usecase';
import { LoginUseCase } from '@application/use-cases/auth/login.usecase';
import { Public } from '@presentation/decorators/public.decorator';

/**
 * Controller de Autenticação
 * Gerencia rotas de registro e login
 */
@ApiTags('auth')
@Controller('auth')
@Public() // Rotas de autenticação são públicas
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.registerUserUseCase.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto);
  }
}
