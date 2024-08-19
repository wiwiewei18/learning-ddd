import { AppConfiguration } from '../../../../config/appConfig';
import { ContentTypes } from './contentStorageService';
import { S3ContentStorageService } from './s3ContentStorageService';

let s3ContentStorageService: S3ContentStorageService;
const testDirPath = ContentTypes.TEST;

describe('S3ContentStorageService', () => {
  const config = new AppConfiguration();

  beforeEach(() => {
    s3ContentStorageService = new S3ContentStorageService(config.getContentStorageServiceConfiguration());
  });

  afterEach(async () => {
    const contentUrls = await s3ContentStorageService.getAllUrlsByContentType(testDirPath);

    await Promise.all(contentUrls.map(async (c) => s3ContentStorageService.deleteByUrl(c)));
  }, 100000);

  it('should be able to save content to s3 bucket', async () => {
    const testData = 'hello s3';

    const publicUrl = await s3ContentStorageService.save(testDirPath, 'test data', Buffer.from(testData));

    expect(publicUrl).toEqual(expect.any(String));

    const content = await s3ContentStorageService.getByUrl(publicUrl);

    expect(content).toEqual(testData);
  });
});
