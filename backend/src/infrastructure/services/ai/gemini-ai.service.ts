import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  IAIService,
  FoodAnalysisResult,
  RecipeSuggestion,
} from '@application/ports/services/ai.service.interface';
import { Macros } from '@domain/value-objects';

@Injectable()
export class GeminiAIService implements IAIService {
  private readonly logger = new Logger(GeminiAIService.name);
  private readonly model;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    this.logger.log('GeminiAIService initialized successfully');
  }

  async analyzeFoodImage(imageUrl: string): Promise<FoodAnalysisResult> {
    this.logger.debug(`Analyzing food image: ${imageUrl}`);

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    return this.analyzeFoodImageBase64(base64Image, contentType);
  }

  async analyzeFoodImageBase64(
    base64Image: string,
    mimeType: string,
  ): Promise<FoodAnalysisResult> {
    this.logger.debug(`Analyzing food image from base64, mimeType: ${mimeType}`);

    try {
      const result = await this.model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType,
          },
        },
        { text: this.getFoodAnalysisPrompt() },
      ]);

      const text = result.response.text();
      return this.parseResponse(text);
    } catch (error) {
      this.logger.error('Error analyzing food image', error);
      throw new Error('Failed to analyze food image with AI');
    }
  }

  async analyzeFoodAudio(audioUrl: string): Promise<FoodAnalysisResult> {
    throw new Error('Audio analysis not implemented yet');
  }

  async suggestRecipes(
    _remainingCalories: number,
    _remainingMacros: { carbs: number; protein: number; fat: number },
  ): Promise<RecipeSuggestion[]> {
    throw new Error('Recipe suggestion not implemented for Gemini provider');
  }

  async analyzeFoodDescription(
    description: string,
  ): Promise<FoodAnalysisResult> {
    this.logger.debug(`Analyzing food description: ${description}`);

    try {
      const result = await this.model.generateContent(
        this.getFoodDescriptionPrompt(description),
      );

      const text = result.response.text();
      return this.parseResponse(text);
    } catch (error) {
      this.logger.error('Error analyzing food description', error);
      throw new Error('Failed to analyze food description with AI');
    }
  }

  private getFoodAnalysisPrompt(): string {
    const currentHour = new Date().getHours();

    return `Você é um nutricionista especializado. Analise esta imagem de comida e retorne APENAS um JSON válido com as seguintes informações:

{
  "foods": ["alimento1", "alimento2", "alimento3"],
  "calories": número_total_de_calorias,
  "macros": {
    "carbs": gramas_de_carboidratos,
    "protein": gramas_de_proteínas,
    "fat": gramas_de_gorduras
  },
  "mealName": "nome_da_refeição",
  "confidence": número_de_0_a_100
}

REGRAS IMPORTANTES:
1. Identifique TODOS os alimentos visíveis na imagem
2. Estime porções REALISTAS (não exagere nem subestime)
3. Use a Tabela Brasileira de Composição de Alimentos (TACO) como referência
4. O campo "mealName" deve ser baseado no horário atual (${currentHour}h):
   - 5h-10h: "Café da Manhã"
   - 10h-13h: "Lanche da Manhã"
   - 11h-15h: "Almoço"
   - 15h-18h: "Lanche da Tarde"
   - 18h-22h: "Jantar"
   - 22h-5h: "Ceia"
5. O campo "confidence" deve refletir sua certeza na identificação (0-100)
6. Retorne APENAS o JSON, sem texto adicional, sem markdown, sem explicações`;
  }

  private getFoodDescriptionPrompt(description: string): string {
    const currentHour = new Date().getHours();

    return `Você é um nutricionista especializado. O usuário descreveu sua refeição como:

"${description}"

Analise os alimentos mencionados e retorne APENAS um JSON válido com as seguintes informações:

{
  "foods": ["alimento1", "alimento2", "alimento3"],
  "calories": número_total_de_calorias,
  "macros": {
    "carbs": gramas_de_carboidratos,
    "protein": gramas_de_proteínas,
    "fat": gramas_de_gorduras
  },
  "mealName": "nome_da_refeição",
  "confidence": número_de_0_a_100
}

REGRAS IMPORTANTES:
1. Identifique TODOS os alimentos mencionados na descrição
2. Use as quantidades mencionadas pelo usuário. Se não informou quantidade, estime porções REALISTAS
3. Use a Tabela Brasileira de Composição de Alimentos (TACO) como referência
4. O campo "mealName" deve ser baseado no horário atual (${currentHour}h):
   - 5h-10h: "Café da Manhã"
   - 10h-13h: "Lanche da Manhã"
   - 11h-15h: "Almoço"
   - 15h-18h: "Lanche da Tarde"
   - 18h-22h: "Jantar"
   - 22h-5h: "Ceia"
5. O campo "confidence" deve ser alto (85-95) pois o usuário descreveu diretamente
6. Retorne APENAS o JSON, sem texto adicional, sem markdown, sem explicações`;
  }

  private parseResponse(text: string): FoodAnalysisResult {
    try {
      this.logger.debug(`Gemini response: ${text}`);

      const cleanJson = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleanJson);

      if (!parsed.foods || !Array.isArray(parsed.foods)) {
        throw new Error('Invalid foods array in response');
      }
      if (typeof parsed.calories !== 'number') {
        throw new Error('Invalid calories in response');
      }
      if (!parsed.macros || typeof parsed.macros !== 'object') {
        throw new Error('Invalid macros in response');
      }

      const macros = new Macros(
        parsed.macros.carbs || 0,
        parsed.macros.protein || 0,
        parsed.macros.fat || 0,
      );

      return {
        foods: parsed.foods,
        calories: parsed.calories,
        macros,
        mealName: parsed.mealName || this.getDefaultMealName(),
        confidence: parsed.confidence || 0,
      };
    } catch (error) {
      this.logger.error('Error parsing Gemini response', error);
      throw new Error('Failed to parse AI response');
    }
  }

  private getDefaultMealName(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'Café da Manhã';
    if (hour >= 10 && hour < 12) return 'Lanche da Manhã';
    if (hour >= 12 && hour < 15) return 'Almoço';
    if (hour >= 15 && hour < 18) return 'Lanche da Tarde';
    if (hour >= 18 && hour < 22) return 'Jantar';
    return 'Ceia';
  }
}
