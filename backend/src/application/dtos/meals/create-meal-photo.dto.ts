import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para criação de refeição a partir de foto
 * RF009 - Registro por Foto
 */
export class CreateMealPhotoDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Foto da refeição (máximo 10MB)',
  })
  photo: Express.Multer.File;

  @ApiProperty({
    example: '2024-01-15T12:30:00Z',
    description: 'Horário da refeição (opcional, padrão: agora)',
    required: false,
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  mealTime?: Date;
}
