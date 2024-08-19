export type ContentStorageServiceConfiguration = {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucketName: string;
  publicUrl: string;
  saveLocationBaseDirPath: string;
};

export type PublicUrl = string;

export type ContentName = string;

export enum ContentTypes {
  IMAGE = 'images',
  TEST = 'tests',
}

export interface ContentStorageService {
  save(type: ContentTypes, name: string, content: Buffer): Promise<PublicUrl>;
  getByUrl(url: PublicUrl): Promise<string>;
  getAllUrlsByContentType(type: ContentTypes): Promise<string[]>;
  deleteByUrl(url: PublicUrl): Promise<void>;
}
