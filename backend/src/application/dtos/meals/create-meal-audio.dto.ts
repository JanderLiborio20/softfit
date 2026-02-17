import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para criação de refeição a partir de áudio
 * RF010 - Registro por Áudio
 */
export class CreateMealAudioDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Áudio descrevendo a refeição (máximo 10MB)',
  })
  audio: Express.Multer.File;

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
