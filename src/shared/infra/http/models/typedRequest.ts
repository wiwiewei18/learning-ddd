import { Request } from 'express';
import { FileArray } from 'express-fileupload';
import { Query } from 'express-serve-static-core';

export interface TypedRequest<
  TQuery extends Query = Record<string, never>,
  TBody = Record<string, never>,
  TFiles extends FileArray = Record<string, never>,
> extends Request {
  body: TBody;
  query: TQuery;
  files?: TFiles;
}
