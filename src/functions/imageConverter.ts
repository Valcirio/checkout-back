export type Base64ConversionResult = {
  buffer: Buffer;
  contentType: string;
} | null

export function convertBase64ToBuffer(base64String: string): Base64ConversionResult {
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('Entrada Base64 inválida: deve ser uma string não vazia.');
    }
  
    let actualBase64Data: string;
    let contentType: string | null = null;
  
    const dataUrlMatch = base64String.match(/^data:([a-zA-Z0-9\/\+\-\.]+);base64,(.*)$/s);

    if (dataUrlMatch && dataUrlMatch.length === 3) {
      contentType = dataUrlMatch[1];
      actualBase64Data = dataUrlMatch[2];
    } else {
      actualBase64Data = base64String;
    }
  
    if (!contentType) {
      throw new Error('Imagem não suportada.');
    }
  
    try {
      const buffer = Buffer.from(actualBase64Data, 'base64');
      return { buffer, contentType };
    } catch (error) {
      console.error("Erro ao converter Base64 para Buffer:", error);
      throw new Error('Falha ao decodificar a string Base64. Verifique se é uma string Base64 válida.');
    }
  }