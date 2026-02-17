import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * DTO para solicitação de vínculo com nutricionista
 * RF030 - Solicitação de Vínculo
 */
export class LinkRequestDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  nutritionistId: string;
}
