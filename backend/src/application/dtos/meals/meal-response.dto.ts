import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de resposta com dados da refeição
 */
export class MealResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: 'Café da Manhã' })
  name: string;

  @ApiProperty({
    example: 'https://storage.example.com/meals/photo.jpg',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    example: 'https://storage.example.com/meals/audio.mp3',
    nullable: true,
  })
  audioUrl: string | null;

  @ApiProperty({ example: ['Pão integral', 'Ovo mexido', 'Café com leite'] })
  foods: string[];

  @ApiProperty({ example: 450 })
  calories: number;

  @ApiProperty({
    example: {
      carbsGrams: 50,
      proteinGrams: 30,
      fatGrams: 15,
    },
  })
  macros: {
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
  };

  @ApiProperty({ example: '2024-01-15T08:30:00Z' })
  mealTime: Date;

  @ApiProperty({ example: 85, description: 'Confiança da IA (0-100)' })
  confidence: number;

  @ApiProperty({ example: true, description: 'Se a refeição pode ser editada (< 7 dias)' })
  canBeEdited: boolean;

  @ApiProperty({ example: 2, description: 'Idade da refeição em dias' })
  ageInDays: number;

  @ApiProperty({ example: '2024-01-15T08:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T08:30:00Z' })
  updatedAt: Date;
}

/**
 * DTO de resposta para lista de refeições
 */
export class MealListResponseDto {
  @ApiProperty({ type: [MealResponseDto] })
  meals: MealResponseDto[];

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: { totalCalories: 2000, totalCarbs: 250, totalProtein: 150, totalFat: 67 } })
  summary: {
    totalCalories: number;
    totalCarbs: number;
    totalProtein: number;
    totalFat: number;
  };
}

/**
 * DTO de resposta temporária após processamento da IA
 * RF011 - Processamento por IA
 */
export class AIProcessingResponseDto {
  @ApiProperty({ example: 'Almoço' })
  suggestedName: string;

  @ApiProperty({ example: ['Arroz', 'Feijão', 'Frango grelhado', 'Salada'] })
  identifiedFoods: string[];

  @ApiProperty({ example: 650 })
  estimatedCalories: number;

  @ApiProperty({
    example: {
      carbsGrams: 80,
      proteinGrams: 45,
      fatGrams: 20,
    },
  })
  estimatedMacros: {
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
  };

  @ApiProperty({ example: 85, description: 'Confiança da IA (0-100)' })
  confidence: number;

  @ApiProperty({ example: 'https://storage.example.com/temp/photo-123.jpg' })
  tempFileUrl: string;

  @ApiProperty({ example: 'temp-id-123', description: 'ID temporário para confirmação' })
  tempId: string;
}
