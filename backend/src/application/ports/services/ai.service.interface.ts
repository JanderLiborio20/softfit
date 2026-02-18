import { Macros } from '@domain/value-objects';

/**
 * Resultado da análise de alimentos por IA
 */
export interface FoodAnalysisResult {
  foods: string[]; // Lista de alimentos identificados
  calories: number; // Total de calorias
  macros: Macros; // Macronutrientes
  mealName: string; // Nome sugerido para a refeição
  confidence: number; // Confiança da análise (0-100)
}

/**
 * Ingrediente de uma receita sugerida
 */
export interface RecipeIngredient {
  name: string;
  amount: string;
}

/**
 * Receita sugerida pela IA
 */
export interface RecipeSuggestion {
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  preparationSteps: string[];
  estimatedCalories: number;
  estimatedMacros: {
    carbs: number;
    protein: number;
    fat: number;
  };
  prepTimeMinutes: number;
}

/**
 * Port (Interface) do Serviço de IA
 * Define contrato para processamento de imagens e áudio com IA
 */
export interface IAIService {
  /**
   * Analisa uma imagem de comida e retorna informações nutricionais
   * @param imageUrl URL da imagem ou base64
   * @returns Análise nutricional da imagem
   */
  analyzeFoodImage(imageUrl: string): Promise<FoodAnalysisResult>;

  /**
   * Analisa um áudio descrevendo alimentos e retorna informações nutricionais
   * @param audioUrl URL do áudio ou base64
   * @returns Análise nutricional do áudio
   */
  analyzeFoodAudio(audioUrl: string): Promise<FoodAnalysisResult>;

  /**
   * Analisa uma imagem de comida usando base64
   * @param base64Image Imagem em base64
   * @param mimeType Tipo MIME da imagem (image/jpeg, image/png, etc)
   * @returns Análise nutricional da imagem
   */
  analyzeFoodImageBase64(base64Image: string, mimeType: string): Promise<FoodAnalysisResult>;

  /**
   * Analisa uma descrição textual de alimentos e retorna informações nutricionais
   * @param description Descrição textual dos alimentos (ex: "100g de arroz, 2 ovos e frango grelhado")
   * @returns Análise nutricional dos alimentos descritos
   */
  analyzeFoodDescription(description: string): Promise<FoodAnalysisResult>;

  /**
   * Sugere receitas baseadas nos macros restantes do dia
   * @param remainingCalories Calorias restantes
   * @param remainingMacros Macros restantes (carbs, protein, fat em gramas)
   * @returns Array de receitas sugeridas
   */
  suggestRecipes(
    remainingCalories: number,
    remainingMacros: { carbs: number; protein: number; fat: number },
  ): Promise<RecipeSuggestion[]>;
}
