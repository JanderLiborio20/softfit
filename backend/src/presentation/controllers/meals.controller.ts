import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/guards/roles.guard';
import { CurrentUser, JwtPayload } from '@presentation/decorators/current-user.decorator';
import { Roles } from '@presentation/decorators/roles.decorator';
import { UserRole } from '@domain/enums';
import {
  ConfirmMealDto,
  UpdateMealDto,
  MealResponseDto,
  MealListResponseDto,
  AIProcessingResponseDto,
} from '@application/dtos/meals';
import { ListMealsUseCase } from '@application/use-cases/meals/list-meals.usecase';
import { ConfirmMealUseCase } from '@application/use-cases/meals/confirm-meal.usecase';
import { ProcessMealPhotoUseCase } from '@application/use-cases/meals/process-meal-photo.usecase';

@ApiTags('meals')
@Controller('meals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CLIENT)
@ApiBearerAuth()
export class MealsController {
  constructor(
    private readonly listMealsUseCase: ListMealsUseCase,
    private readonly confirmMealUseCase: ConfirmMealUseCase,
    private readonly processMealPhotoUseCase: ProcessMealPhotoUseCase,
  ) {}

  @Post('photo')
  @UseInterceptors(FileInterceptor('photo', { storage: undefined }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Registrar refeição por foto (RF009, RF011)' })
  @ApiResponse({ status: 201, type: AIProcessingResponseDto })
  async uploadPhoto(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<AIProcessingResponseDto> {
    return this.processMealPhotoUseCase.execute(photo);
  }

  @Post('audio')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Registrar refeição por áudio (RF010, RF011)' })
  @ApiResponse({ status: 201, type: AIProcessingResponseDto })
  async uploadAudio(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() audio: Express.Multer.File,
  ): Promise<AIProcessingResponseDto> {
    // TODO: Implementar processamento por IA
    throw new Error('Not implemented');
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirmar/salvar refeição processada (RF012)' })
  @ApiResponse({ status: 201, type: MealResponseDto })
  async confirmMeal(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ConfirmMealDto,
  ): Promise<MealResponseDto> {
    return this.confirmMealUseCase.execute(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar refeições por data (RF013)' })
  @ApiResponse({ status: 200, type: MealListResponseDto })
  async listMeals(
    @CurrentUser() user: JwtPayload,
    @Query('date') date?: string,
  ): Promise<MealListResponseDto> {
    return this.listMealsUseCase.execute(user.sub, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Visualizar detalhes de uma refeição (RF014)' })
  @ApiResponse({ status: 200, type: MealResponseDto })
  async getMeal(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MealResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar refeição (RF015)' })
  @ApiResponse({ status: 200, type: MealResponseDto })
  async updateMeal(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMealDto,
  ): Promise<MealResponseDto> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar refeição (RF015)' })
  @ApiResponse({ status: 204 })
  async deleteMeal(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    // TODO: Implementar use case
    throw new Error('Not implemented');
  }
}
