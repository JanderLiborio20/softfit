import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
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
  CreateNutritionistProfileDto,
  LinkRequestDto,
  CreateNutritionPlanDto,
  UpdateClientGoalsDto,
  NutritionistProfileResponseDto,
  LinkResponseDto,
  NutritionPlanResponseDto,
} from '@application/dtos/nutritionists';
import { ProfileResponseDto } from '@application/dtos/profile';

/**
 * Controller de Nutricionistas
 * RF022-RF032 - Gestão de nutricionistas, vínculos e planos alimentares
 */
@ApiTags('nutritionists')
@Controller('nutritionists')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NutritionistsController {
  constructor() {}

  // === Perfil do Nutricionista ===

  @Post('profile')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Criar perfil profissional de nutricionista (RF002)' })
  @ApiResponse({ status: 201, type: NutritionistProfileResponseDto })
  async createProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateNutritionistProfileDto,
  ): Promise<NutritionistProfileResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Get('search')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Buscar nutricionistas (RF029)' })
  @ApiResponse({ status: 200, type: [NutritionistProfileResponseDto] })
  async searchNutritionists(
    @Query('state') state?: string,
    @Query('specialty') specialty?: string,
  ): Promise<NutritionistProfileResponseDto[]> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Get(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Visualizar perfil de nutricionista' })
  @ApiResponse({ status: 200, type: NutritionistProfileResponseDto })
  async getNutritionistProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NutritionistProfileResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  // === Vínculos Cliente-Nutricionista ===

  @Post('link')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Solicitar vínculo com nutricionista (RF030)' })
  @ApiResponse({ status: 201, type: LinkResponseDto })
  async requestLink(
    @CurrentUser() user: JwtPayload,
    @Body() dto: LinkRequestDto,
  ): Promise<LinkResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Put('link/:id/accept')
  @Roles(UserRole.NUTRITIONIST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aceitar solicitação de vínculo (RF031)' })
  @ApiResponse({ status: 200, type: LinkResponseDto })
  async acceptLink(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) linkId: string,
  ): Promise<LinkResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Put('link/:id/reject')
  @Roles(UserRole.NUTRITIONIST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rejeitar solicitação de vínculo (RF031)' })
  @ApiResponse({ status: 200, type: LinkResponseDto })
  async rejectLink(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) linkId: string,
  ): Promise<LinkResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Put('link/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Encerrar vínculo (RF032)' })
  @ApiResponse({ status: 200, type: LinkResponseDto })
  async cancelLink(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) linkId: string,
  ): Promise<LinkResponseDto> {
    // TODO: Implementar use case - verifica role e chama método apropriado
    throw new Error('Not implemented');
  }

  // === Gestão de Clientes pelo Nutricionista ===

  @Get('my-clients')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Listar meus clientes (RF022, RF023)' })
  @ApiResponse({ status: 200, type: [ProfileResponseDto] })
  async getMyClients(@CurrentUser() user: JwtPayload): Promise<ProfileResponseDto[]> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Get('clients/:clientId')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Visualizar perfil de cliente (RF023)' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async getClientProfile(
    @CurrentUser() user: JwtPayload,
    @Param('clientId', ParseUUIDPipe) clientId: string,
  ): Promise<ProfileResponseDto> {
    // TODO: Implementar use case - verificar vínculo ativo
    throw new Error('Not implemented');
  }

  @Put('clients/:clientId/goals')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Ajustar metas do cliente (RF026, RN005)' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async updateClientGoals(
    @CurrentUser() user: JwtPayload,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() dto: UpdateClientGoalsDto,
  ): Promise<ProfileResponseDto> {
    // TODO: Implementar use case - verificar vínculo ativo
    throw new Error('Not implemented');
  }

  // === Planos Alimentares ===

  @Post('nutrition-plans')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Criar plano alimentar (RF024)' })
  @ApiResponse({ status: 201, type: NutritionPlanResponseDto })
  async createNutritionPlan(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateNutritionPlanDto,
  ): Promise<NutritionPlanResponseDto> {
    // TODO: Implementar use case - verificar vínculo ativo
    throw new Error('Not implemented');
  }

  @Get('nutrition-plans/my-plans')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Listar meus planos alimentares' })
  @ApiResponse({ status: 200, type: [NutritionPlanResponseDto] })
  async getMyNutritionPlans(@CurrentUser() user: JwtPayload): Promise<NutritionPlanResponseDto[]> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Get('nutrition-plans/:id')
  @ApiOperation({ summary: 'Visualizar plano alimentar' })
  @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
  async getNutritionPlan(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NutritionPlanResponseDto> {
    // TODO: Implementar use case - verificar permissão (cliente ou nutricionista do plano)
    throw new Error('Not implemented');
  }
}
