import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { ImageResizeConfig } from './imageService';
import { SharpImageService } from './sharpImageService';

let sharpImageService: SharpImageService;
const imageFixtureBuffer = fs.readFileSync(path.join(__dirname, 'tests/fixtures/cat.jpg'));

describe('SharpImageService', () => {
  beforeEach(() => {
    sharpImageService = new SharpImageService();
  });

  it('should be able to resize single image based on the given options', async () => {
    const resizeOptions: ImageResizeConfig = {
      extension: 'webp',
      width: 200,
    };

    const resizedBuffer = await sharpImageService.resizeImage(imageFixtureBuffer, {
      extension: resizeOptions.extension,
      width: resizeOptions.width,
    });

    const resizedImageMetadata = await sharp(resizedBuffer).metadata();

    expect(resizedImageMetadata.format).toBe(resizeOptions.extension);
    expect(resizedImageMetadata.width).toBe(resizeOptions.width);
  });

  it('should be able to resize image in bulk with single image buffer', async () => {
    const resizeOptionOne: ImageResizeConfig = {
      extension: 'webp',
      width: 200,
    };

    const resizeOptionTwo: ImageResizeConfig = {
      extension: 'png',
      width: 500,
    };

    const resizedBuffers = await sharpImageService.resizeImageBulk(imageFixtureBuffer, [resizeOptionOne, resizeOptionTwo]);

    const resizedBufferOne = resizedBuffers.find((b) => b.config.extension === resizeOptionOne.extension)?.buffer;
    const resizedBufferTwo = resizedBuffers.find((b) => b.config.extension === resizeOptionTwo.extension)?.buffer;

    const resizedImageMetadataOne = await sharp(resizedBufferOne).metadata();
    const resizedImageMetadataTwo = await sharp(resizedBufferTwo).metadata();

    expect(resizedImageMetadataOne.format).toBe(resizeOptionOne.extension);
    expect(resizedImageMetadataOne.width).toBe(resizeOptionOne.width);

    expect(resizedImageMetadataTwo.format).toBe(resizeOptionTwo.extension);
    expect(resizedImageMetadataTwo.width).toBe(resizeOptionTwo.width);
  });
});
