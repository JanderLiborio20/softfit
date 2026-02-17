import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/guards/roles.guard';
import { CurrentUser, JwtPayload } from '@presentation/decorators/current-user.decorator';
import { Roles } from '@presentation/decorators/roles.decorator';
import { UserRole } from '@domain/enums';
import {
  OnboardingDto,
  UpdateProfileDto,
  UpdateGoalsDto,
  ProfileResponseDto,
} from '@application/dtos/profile';
import { CompleteOnboardingUseCase } from '@application/use-cases/profile/complete-onboarding.usecase';
import { GetProfileUseCase } from '@application/use-cases/profile/get-profile.usecase';
import { UpdateProfileUseCase } from '@application/use-cases/profile/update-profile.usecase';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(
    private readonly completeOnboardingUseCase: CompleteOnboardingUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Post('onboarding')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Completar onboarding do cliente (RF005)' })
  @ApiResponse({ status: 201, description: 'Perfil criado com sucesso', type: ProfileResponseDto })
  async completeOnboarding(
    @CurrentUser() user: JwtPayload,
    @Body() dto: OnboardingDto,
  ): Promise<ProfileResponseDto> {
    return this.completeOnboardingUseCase.execute(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async getProfile(@CurrentUser() user: JwtPayload): Promise<ProfileResponseDto> {
    return this.getProfileUseCase.execute(user.sub);
  }

  @Put()
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Atualizar perfil do cliente (RF007)' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.updateProfileUseCase.execute(user.sub, dto);
  }

  @Put('goals')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Atualizar metas manualmente (RF008)' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async updateGoals(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateGoalsDto,
  ): Promise<ProfileResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }
}
