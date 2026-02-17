import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * DTO para criação de perfil de nutricionista
 * RF002 - Cadastro de Nutricionista
 */
export class CreateNutritionistProfileDto {
  @ApiProperty({ example: 'Dr. João Silva' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: '12345', description: 'Número do CRN (4-6 dígitos)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4,6}$/, { message: 'CRN deve conter 4-6 dígitos' })
  crn: string;

  @ApiProperty({ example: 'SP', description: 'Estado do registro (sigla)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve ser uma sigla válida (ex: SP, RJ)' })
  crnState: string;

  @ApiProperty({ example: 'Nutricionista especializado em nutrição esportiva', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({ example: ['Nutrição esportiva', 'Emagrecimento'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];
}
