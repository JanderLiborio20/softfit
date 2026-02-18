import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto, LoginDto, AuthResponseDto, ChangePasswordDto } from '@application/dtos/auth';
import { RegisterUserUseCase } from '@application/use-cases/auth/register-user.usecase';
import { LoginUseCase } from '@application/use-cases/auth/login.usecase';
import { ChangePasswordUseCase } from '@application/use-cases/auth/change-password.usecase';
import { Public } from '@presentation/decorators/public.decorator';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/decorators/current-user.decorator';

/**
 * Controller de Autenticação
 * Gerencia rotas de registro, login e troca de senha
 */
@ApiTags('auth')
@Controller('auth')
@Public() // Rotas de autenticação são públicas por padrão
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
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

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trocar senha do usuário' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 401, description: 'Senha atual incorreta' })
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.changePasswordUseCase.execute(user.sub, dto);
    return { message: 'Senha alterada com sucesso' };
  }
}
