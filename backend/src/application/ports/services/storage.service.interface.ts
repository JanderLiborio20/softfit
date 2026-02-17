/**
 * Port (Interface) do Serviço de Storage
 * Define contrato para upload e gerenciamento de arquivos
 */
export interface IStorageService {
  /**
   * Faz upload de um arquivo e retorna a URL
   * @param file Buffer do arquivo
   * @param filename Nome do arquivo
   * @param mimeType Tipo MIME do arquivo
   * @returns URL do arquivo armazenado
   */
  upload(file: Buffer, filename: string, mimeType: string): Promise<string>;

  /**
   * Faz upload de uma imagem, otimiza e retorna a URL
   * @param imageBuffer Buffer da imagem
   * @param filename Nome do arquivo
   * @returns URL da imagem armazenada
   */
  uploadImage(imageBuffer: Buffer, filename: string): Promise<string>;

  /**
   * Faz upload de um áudio e retorna a URL
   * @param audioBuffer Buffer do áudio
   * @param filename Nome do arquivo
   * @returns URL do áudio armazenado
   */
  uploadAudio(audioBuffer: Buffer, filename: string): Promise<string>;

  /**
   * Deleta um arquivo
   * @param fileUrl URL do arquivo a ser deletado
   */
  delete(fileUrl: string): Promise<void>;

  /**
   * Obtém a URL pública de um arquivo
   * @param filepath Caminho do arquivo
   * @returns URL pública
   */
  getPublicUrl(filepath: string): string;

  /**
   * Converte imagem para base64
   * @param imageBuffer Buffer da imagem
   * @returns String base64
   */
  imageToBase64(imageBuffer: Buffer): Promise<string>;
}
