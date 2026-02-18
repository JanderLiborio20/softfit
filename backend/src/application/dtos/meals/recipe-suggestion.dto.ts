import { ApiProperty } from '@nestjs/swagger';

export class RecipeIngredientDto {
  @ApiProperty({ example: 'Peito de frango' })
  name: string;

  @ApiProperty({ example: '150g' })
  amount: string;
}

export class RecipeSuggestionDto {
  @ApiProperty({ example: 'Frango grelhado com arroz integral' })
  name: string;

  @ApiProperty({
    example: 'Prato completo rico em proteínas e carboidratos complexos.',
  })
  description: string;

  @ApiProperty({ type: [RecipeIngredientDto] })
  ingredients: RecipeIngredientDto[];

  @ApiProperty({ example: ['Tempere o frango', 'Grelhe por 20 min'] })
  preparationSteps: string[];

  @ApiProperty({ example: 480 })
  estimatedCalories: number;

  @ApiProperty({ example: { carbs: 45, protein: 40, fat: 12 } })
  estimatedMacros: {
    carbs: number;
    protein: number;
    fat: number;
  };

  @ApiProperty({ example: 25 })
  prepTimeMinutes: number;
}

export class RecipeSuggestionsResponseDto {
  @ApiProperty({ type: [RecipeSuggestionDto] })
  recipes: RecipeSuggestionDto[];

  @ApiProperty({
    example: {
      remainingCalories: 600,
      remainingCarbs: 60,
      remainingProtein: 50,
      remainingFat: 20,
    },
  })
  remainingMacros: {
    remainingCalories: number;
    remainingCarbs: number;
    remainingProtein: number;
    remainingFat: number;
  };
}
