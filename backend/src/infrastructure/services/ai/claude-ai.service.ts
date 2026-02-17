import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { IAIService, FoodAnalysisResult } from '@application/ports/services/ai.service.interface';
import { Macros } from '@domain/value-objects';

/**
 * Implementação do serviço de IA usando Claude da Anthropic
 * Processa imagens e áudio para identificar alimentos e calcular valores nutricionais
 */
@Injectable()
export class ClaudeAIService implements IAIService {
  private readonly logger = new Logger(ClaudeAIService.name);
  private readonly client: Anthropic;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not found in environment variables');
    }

    this.client = new Anthropic({
      apiKey,
    });

    this.logger.log('ClaudeAIService initialized successfully');
  }

  /**
   * Analisa imagem de comida usando Claude Vision
   * Faz download da URL e converte para base64 antes de enviar
   */
  async analyzeFoodImage(imageUrl: string): Promise<FoodAnalysisResult> {
    this.logger.debug(`Analyzing food image: ${imageUrl}`);

    try {
      // Fazer download da imagem
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }

      // Obter buffer da imagem
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Converter para base64
      const base64Image = buffer.toString('base64');

      // Detectar mime type do Content-Type header ou da URL
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

      // Usar o método base64 existente
      return this.analyzeFoodImageBase64(base64Image, contentType);
    } catch (error) {
      this.logger.error('Error analyzing food image', error);
      throw new Error('Failed to analyze food image with AI');
    }
  }

  /**
   * Analisa imagem de comida usando base64
   */
  async analyzeFoodImageBase64(base64Image: string, mimeType: string): Promise<FoodAnalysisResult> {
    this.logger.debug(`Analyzing food image from base64, mimeType: ${mimeType}`);

    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: this.getFoodAnalysisPrompt(),
              },
            ],
          },
        ],
      });

      return this.parseAIResponse(response);
    } catch (error) {
      this.logger.error('Error analyzing food image from base64', error);
      throw new Error('Failed to analyze food image with AI');
    }
  }

  /**
   * Analisa áudio descrevendo comida
   * TODO: Implementar quando API do Claude suportar áudio nativamente
   * Por enquanto, pode usar transcrição de áudio para texto primeiro
   */
  async analyzeFoodAudio(audioUrl: string): Promise<FoodAnalysisResult> {
    this.logger.debug(`Analyzing food audio: ${audioUrl}`);

    // TODO: Implementar transcrição de áudio e depois análise do texto
    throw new Error('Audio analysis not implemented yet');
  }

  /**
   * Retorna o prompt otimizado para análise de alimentos
   */
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
5. O campo "confidence" deve refletir sua certeza na identificação (0-100):
   - 90-100: Imagem clara, alimentos bem identificáveis
   - 70-89: Boa identificação mas com alguma incerteza nas porções
   - 50-69: Identificação razoável mas com incertezas
   - <50: Imagem ruim ou alimentos difíceis de identificar
6. Retorne APENAS o JSON, sem texto adicional, sem markdown, sem explicações

Exemplo de resposta válida:
{
  "foods": ["arroz branco", "feijão preto", "filé de frango grelhado", "salada de alface e tomate"],
  "calories": 520,
  "macros": {
    "carbs": 65,
    "protein": 45,
    "fat": 12
  },
  "mealName": "Almoço",
  "confidence": 85
}`;
  }

  /**
   * Faz parse da resposta da API do Claude
   */
  private parseAIResponse(response: any): FoodAnalysisResult {
    try {
      // A resposta do Claude vem em response.content[0].text
      const textContent = response.content.find((block: any) => block.type === 'text');

      if (!textContent) {
        throw new Error('No text content in Claude response');
      }

      const jsonText = textContent.text.trim();
      this.logger.debug(`Claude response: ${jsonText}`);

      // Remove possíveis markdown code blocks
      const cleanJson = jsonText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleanJson);

      // Validar estrutura da resposta
      if (!parsed.foods || !Array.isArray(parsed.foods)) {
        throw new Error('Invalid foods array in response');
      }

      if (typeof parsed.calories !== 'number') {
        throw new Error('Invalid calories in response');
      }

      if (!parsed.macros || typeof parsed.macros !== 'object') {
        throw new Error('Invalid macros in response');
      }

      // Criar Value Object Macros
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
      this.logger.error('Error parsing AI response', error);
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Retorna nome padrão de refeição baseado no horário
   */
  private getDefaultMealName(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 10) return 'Café da Manhã';
    if (hour >= 10 && hour < 13) return 'Lanche da Manhã';
    if (hour >= 11 && hour < 15) return 'Almoço';
    if (hour >= 15 && hour < 18) return 'Lanche da Tarde';
    if (hour >= 18 && hour < 22) return 'Jantar';
    return 'Ceia';
  }
}
