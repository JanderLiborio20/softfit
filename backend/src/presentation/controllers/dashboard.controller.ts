import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/guards/roles.guard';
import { CurrentUser, JwtPayload } from '@presentation/decorators/current-user.decorator';
import { Roles } from '@presentation/decorators/roles.decorator';
import { UserRole } from '@domain/enums';

/**
 * Resposta do dashboard diário
 */
export class DailyDashboardDto {
  date: string;
  consumed: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  goals: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  progress: {
    caloriesPercent: number;
    carbsPercent: number;
    proteinPercent: number;
    fatPercent: number;
  };
  mealsCount: number;
}

/**
 * Controller de Dashboard
 * RF016, RF017 - Dashboard diário e histórico
 */
@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CLIENT)
@ApiBearerAuth()
export class DashboardController {
  constructor() {}

  @Get('daily')
  @ApiOperation({ summary: 'Obter dashboard diário (RF016)' })
  @ApiResponse({ status: 200, type: DailyDashboardDto })
  async getDailyDashboard(
    @CurrentUser() user: JwtPayload,
    @Query('date') date?: string,
  ): Promise<DailyDashboardDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Obter dashboard semanal (RF017)' })
  @ApiResponse({ status: 200 })
  async getWeeklyDashboard(
    @CurrentUser() user: JwtPayload,
    @Query('startDate') startDate?: string,
  ) {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Obter dashboard mensal (RF017)' })
  @ApiResponse({ status: 200 })
  async getMonthlyDashboard(
    @CurrentUser() user: JwtPayload,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }
}
