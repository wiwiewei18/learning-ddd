import sharp from 'sharp';
import { ImageResizeConfig, ImageService, ResizedImageProps } from './imageService';

export class SharpImageService implements ImageService {
  async resizeImage(rawBuffer: Buffer, config: ImageResizeConfig): Promise<Buffer> {
    return sharp(rawBuffer).resize({ width: config.width }).toFormat(config.extension).toBuffer();
  }

  async resizeImageBulk(rawBuffer: Buffer, configList: ImageResizeConfig[]): Promise<ResizedImageProps[]> {
    const resizedImages: ResizedImageProps[] = await Promise.all(
      configList.map(async (config) => {
        const resizedBuffer = await sharp(rawBuffer).resize({ width: config.width }).toFormat(config.extension).toBuffer();
        return {
          buffer: resizedBuffer,
          config,
        };
      }),
    );
    return resizedImages;
  }
}
