import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from '@/utils/s3Client'

type TDeleteImageToS3 = {
    bucketName: string;
    fileName: string;
}

type TUploadImageToS3 = TDeleteImageToS3 & {
  imageBuffer: Buffer;
  contentType: string;
}

export async function uploadImageToS3(
{ bucketName, fileName, imageBuffer, contentType }: TUploadImageToS3): Promise<string> {

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: imageBuffer,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`; 
    return imageUrl;
  } catch (error) {
    throw new Error('Ocorreu um erro ao tentar atualizar a imagem.');
  }
}

export async function deleteImageOnS3(
    { bucketName, fileName }: TDeleteImageToS3): Promise<void> {
    
      const params = {
        Bucket: bucketName,
        Key: fileName
      };
    
      try {
        const command = new DeleteObjectCommand(params);
        const out = await s3Client.send(command);
      } catch (error) {
        throw new Error('Falha ao tentar apagar a imagem do S3.');
      }
    }