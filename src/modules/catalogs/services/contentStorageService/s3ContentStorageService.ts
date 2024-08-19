import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { logger } from '../../../../shared/infra/logger';
import {
  ContentName,
  ContentStorageService,
  ContentStorageServiceConfiguration,
  ContentTypes,
  PublicUrl,
} from './contentStorageService';

export class S3ContentStorageService implements ContentStorageService {
  private s3Client: S3Client;

  constructor(private config: ContentStorageServiceConfiguration) {
    this.s3Client = this.createS3Client();
  }

  private createS3Client() {
    return new S3Client({
      endpoint: this.config.endpoint,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  async getByUrl(url: string): Promise<string> {
    const contentName = new URL(url).pathname.substring(1);

    const res = await this.s3Client.send(new GetObjectCommand({ Bucket: this.config.bucketName, Key: contentName }));

    if (!res.Body) {
      throw new Error();
    }

    return res.Body?.transformToString();
  }

  async getAllUrlsByContentType(type: ContentTypes): Promise<PublicUrl[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.config.bucketName,
      MaxKeys: 100,
      Prefix: `${this.config.saveLocationBaseDirPath}/${type}`,
    });

    let contentNames: ContentName[] = [];

    try {
      let isTruncated = true;

      while (isTruncated) {
        // eslint-disable-next-line @typescript-eslint/naming-convention, no-await-in-loop
        const { Contents, IsTruncated, NextContinuationToken } = await this.s3Client.send(command);

        const rawContents = Contents
          ? Contents?.map((c) => (c.Key ? this.getSaveLocationDirPath(c.Key) : '')).filter((v) => v !== '')
          : [];

        contentNames = contentNames.concat(rawContents);

        isTruncated = IsTruncated || false;

        command.input.ContinuationToken = NextContinuationToken;
      }
    } catch (error) {
      logger.error(error);
    }

    return contentNames;
  }

  private generateContentName(type: ContentTypes, rawName: string): ContentName {
    return `${this.config.saveLocationBaseDirPath}/${type}/${rawName}`;
  }

  private getSaveLocationDirPath(contentName: ContentName): PublicUrl {
    return `${this.config.publicUrl}${contentName}`;
  }

  async save(type: ContentTypes, name: string, content: Buffer): Promise<string> {
    const formattedName = name.replace(/\s+/g, '-');
    const contentName = this.generateContentName(type, formattedName);

    await this.s3Client.send(
      new PutObjectCommand({ Bucket: this.config.bucketName, Key: contentName, Body: content, ACL: 'public-read' }),
    );

    return this.getSaveLocationDirPath(contentName);
  }

  async deleteByUrl(url: string): Promise<void> {
    const contentName = new URL(url).pathname.substring(1);
    await this.s3Client.send(new DeleteObjectCommand({ Bucket: this.config.bucketName, Key: contentName }));
  }
}
