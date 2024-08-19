export interface ImageResizeConfig {
  width: number;
  extension: 'webp' | 'png' | 'jpg' | 'jpeg';
  height?: number;
}

export interface ResizedImageProps {
  buffer: Buffer;
  config: ImageResizeConfig;
}

export interface ImageService {
  resizeImage(rawBuffer: Buffer, config: ImageResizeConfig): Promise<Buffer>;
  resizeImageBulk(rawBuffer: Buffer, config: ImageResizeConfig[]): Promise<ResizedImageProps[]>;
}
