import {
  Controller,
  Post,
  Get,
  Delete,
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
  LogHydrationDto,
  HydrationResponseDto,
  HydrationDailyResponseDto,
} from '@application/dtos/hydration';
import { LogHydrationUseCase } from '@application/use-cases/hydration/log-hydration.usecase';
import { ListHydrationUseCase } from '@application/use-cases/hydration/list-hydration.usecase';
import { DeleteHydrationUseCase } from '@application/use-cases/hydration/delete-hydration.usecase';

@ApiTags('hydration')
@Controller('hydration')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CLIENT)
@ApiBearerAuth()
export class HydrationController {
  constructor(
    private readonly logHydrationUseCase: LogHydrationUseCase,
    private readonly listHydrationUseCase: ListHydrationUseCase,
    private readonly deleteHydrationUseCase: DeleteHydrationUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar consumo de líquido' })
  @ApiResponse({ status: 201, type: HydrationResponseDto })
  async logHydration(
    @CurrentUser() user: JwtPayload,
    @Body() dto: LogHydrationDto,
  ): Promise<HydrationResponseDto> {
    return this.logHydrationUseCase.execute(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros de hidratação por data' })
  @ApiResponse({ status: 200, type: HydrationDailyResponseDto })
  async listHydration(
    @CurrentUser() user: JwtPayload,
    @Query('date') date?: string,
  ): Promise<HydrationDailyResponseDto> {
    return this.listHydrationUseCase.execute(user.sub, date);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover registro de hidratação' })
  @ApiResponse({ status: 204 })
  async deleteHydration(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.deleteHydrationUseCase.execute(user.sub, id);
  }
}
