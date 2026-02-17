import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
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
import { CreateWorkoutDto, AddExerciseDto, WorkoutResponseDto } from '@application/dtos/workouts';

/**
 * Controller de Treinos
 * RF018-RF021 - Criação, gestão e registro de treinos
 */
@ApiTags('workouts')
@Controller('workouts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CLIENT)
@ApiBearerAuth()
export class WorkoutsController {
  constructor() {}

  @Post()
  @ApiOperation({ summary: 'Criar ficha de treino (RF018)' })
  @ApiResponse({ status: 201, type: WorkoutResponseDto })
  async createWorkout(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateWorkoutDto,
  ): Promise<WorkoutResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Post(':id/exercises')
  @ApiOperation({ summary: 'Adicionar exercício à ficha (RF019)' })
  @ApiResponse({ status: 201, type: WorkoutResponseDto })
  async addExercise(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) workoutId: string,
    @Body() dto: AddExerciseDto,
  ): Promise<WorkoutResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Get()
  @ApiOperation({ summary: 'Listar fichas de treino (RF021)' })
  @ApiResponse({ status: 200, type: [WorkoutResponseDto] })
  async listWorkouts(@CurrentUser() user: JwtPayload): Promise<WorkoutResponseDto[]> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Visualizar ficha de treino com exercícios (RF021)' })
  @ApiResponse({ status: 200, type: WorkoutResponseDto })
  async getWorkout(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WorkoutResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Put(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ativar ficha de treino' })
  @ApiResponse({ status: 200, type: WorkoutResponseDto })
  async activateWorkout(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WorkoutResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Put(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desativar ficha de treino' })
  @ApiResponse({ status: 200, type: WorkoutResponseDto })
  async deactivateWorkout(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WorkoutResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Delete(':workoutId/exercises/:exerciseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover exercício da ficha' })
  @ApiResponse({ status: 204 })
  async removeExercise(
    @CurrentUser() user: JwtPayload,
    @Param('workoutId', ParseUUIDPipe) workoutId: string,
    @Param('exerciseId', ParseUUIDPipe) exerciseId: string,
  ): Promise<void> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }
}
