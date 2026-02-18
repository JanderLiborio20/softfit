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
  RequestLinkToClientDto,
  CreateNutritionPlanDto,
  NutritionistProfileResponseDto,
  NutritionPlanResponseDto,
  LinkResponseDto,
} from '@application/dtos/nutritionists';
import { CreateNutritionistProfileUseCase } from '@application/use-cases/nutritionists/create-nutritionist-profile.usecase';
import { SearchClientByEmailUseCase } from '@application/use-cases/nutritionists/search-client-by-email.usecase';
import { RequestLinkUseCase } from '@application/use-cases/nutritionists/request-link.usecase';
import { AcceptLinkUseCase } from '@application/use-cases/nutritionists/accept-link.usecase';
import { RejectLinkUseCase } from '@application/use-cases/nutritionists/reject-link.usecase';
import { GetPendingLinksUseCase } from '@application/use-cases/nutritionists/get-pending-links.usecase';
import { GetMyClientsUseCase } from '@application/use-cases/nutritionists/get-my-clients.usecase';
import { GetClientDataUseCase } from '@application/use-cases/nutritionists/get-client-data.usecase';
import { CreateNutritionPlanUseCase } from '@application/use-cases/nutrition-plans/create-nutrition-plan.usecase';
import { ListNutritionPlansUseCase } from '@application/use-cases/nutrition-plans/list-nutrition-plans.usecase';
import { GetNutritionPlanUseCase } from '@application/use-cases/nutrition-plans/get-nutrition-plan.usecase';
import { DeactivateNutritionPlanUseCase } from '@application/use-cases/nutrition-plans/deactivate-nutrition-plan.usecase';

@ApiTags('nutritionists')
@Controller('nutritionists')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NutritionistsController {
  constructor(
    private readonly createProfileUC: CreateNutritionistProfileUseCase,
    private readonly searchClientUC: SearchClientByEmailUseCase,
    private readonly requestLinkUC: RequestLinkUseCase,
    private readonly acceptLinkUC: AcceptLinkUseCase,
    private readonly rejectLinkUC: RejectLinkUseCase,
    private readonly getPendingLinksUC: GetPendingLinksUseCase,
    private readonly getMyClientsUC: GetMyClientsUseCase,
    private readonly getClientDataUC: GetClientDataUseCase,
    private readonly createPlanUC: CreateNutritionPlanUseCase,
    private readonly listPlansUC: ListNutritionPlansUseCase,
    private readonly getPlanUC: GetNutritionPlanUseCase,
    private readonly deactivatePlanUC: DeactivateNutritionPlanUseCase,
  ) {}

  // === Perfil do Nutricionista ===

  @Post('profile')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Criar perfil profissional de nutricionista' })
  @ApiResponse({ status: 201, type: NutritionistProfileResponseDto })
  async createProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateNutritionistProfileDto,
  ): Promise<NutritionistProfileResponseDto> {
    return this.createProfileUC.execute(user.sub, dto);
  }

  // === Busca de clientes ===

  @Get('search-clients')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Buscar cliente por email' })
  async searchClientByEmail(
    @Query('email') email: string,
  ): Promise<{ userId: string; name: string; email: string } | null> {
    return this.searchClientUC.execute(email);
  }

  // === Vínculos ===

  @Post('link')
  @Roles(UserRole.NUTRITIONIST)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar solicitação de vínculo para cliente' })
  @ApiResponse({ status: 201, type: LinkResponseDto })
  async requestLink(
    @CurrentUser() user: JwtPayload,
    @Body() dto: RequestLinkToClientDto,
  ): Promise<LinkResponseDto> {
    return this.requestLinkUC.execute(user.sub, dto.clientId);
  }

  @Put('link/:id/accept')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aceitar solicitação de vínculo' })
  @ApiResponse({ status: 200, type: LinkResponseDto })
  async acceptLink(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) linkId: string,
  ): Promise<LinkResponseDto> {
    return this.acceptLinkUC.execute(user.sub, linkId);
  }

  @Put('link/:id/reject')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rejeitar solicitação de vínculo' })
  @ApiResponse({ status: 200, type: LinkResponseDto })
  async rejectLink(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) linkId: string,
  ): Promise<LinkResponseDto> {
    return this.rejectLinkUC.execute(user.sub, linkId);
  }

  // === Solicitações pendentes (cliente) ===

  @Get('my-links/pending')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Listar solicitações pendentes do cliente' })
  async getPendingLinks(@CurrentUser() user: JwtPayload) {
    return this.getPendingLinksUC.execute(user.sub);
  }

  // === Gestão de Clientes pelo Nutricionista ===

  @Get('my-clients')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Listar meus clientes vinculados' })
  async getMyClients(@CurrentUser() user: JwtPayload) {
    return this.getMyClientsUC.execute(user.sub);
  }

  @Get('clients/:clientId')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Visualizar dados de um cliente vinculado' })
  async getClientData(
    @CurrentUser() user: JwtPayload,
    @Param('clientId', ParseUUIDPipe) clientId: string,
  ) {
    return this.getClientDataUC.execute(user.sub, clientId);
  }

  // === Planos Alimentares ===

  @Post('nutrition-plans')
  @Roles(UserRole.NUTRITIONIST)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar plano alimentar para um cliente' })
  @ApiResponse({ status: 201, type: NutritionPlanResponseDto })
  async createNutritionPlan(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateNutritionPlanDto,
  ): Promise<NutritionPlanResponseDto> {
    return this.createPlanUC.execute(user.sub, dto);
  }

  @Get('nutrition-plans/client/:clientId')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Listar planos alimentares de um cliente' })
  @ApiResponse({ status: 200, type: [NutritionPlanResponseDto] })
  async listClientPlans(
    @CurrentUser() user: JwtPayload,
    @Param('clientId', ParseUUIDPipe) clientId: string,
  ): Promise<NutritionPlanResponseDto[]> {
    return this.listPlansUC.executeForNutritionist(user.sub, clientId);
  }

  @Get('nutrition-plans/:id')
  @Roles(UserRole.NUTRITIONIST)
  @ApiOperation({ summary: 'Visualizar detalhes de um plano alimentar' })
  @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
  async getNutritionPlan(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) planId: string,
  ): Promise<NutritionPlanResponseDto> {
    return this.getPlanUC.execute(user.sub, planId);
  }

  @Put('nutrition-plans/:id/deactivate')
  @Roles(UserRole.NUTRITIONIST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desativar plano alimentar' })
  @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
  async deactivateNutritionPlan(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) planId: string,
  ): Promise<NutritionPlanResponseDto> {
    return this.deactivatePlanUC.execute(user.sub, planId);
  }

  // === Plano ativo do Cliente ===

  @Get('my-plan')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Ver meu plano alimentar ativo' })
  @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
  async getMyActivePlan(
    @CurrentUser() user: JwtPayload,
  ): Promise<NutritionPlanResponseDto | null> {
    return this.listPlansUC.executeForClient(user.sub);
  }
}
