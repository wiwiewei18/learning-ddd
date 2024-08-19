import { Request, Response } from 'express';
import { ParamsDictionary, Send } from 'express-serve-static-core';

export const stubRequest = () => new StubRequestImpl() as unknown as StubRequest & Request;

export const stubResponse = (): StubResponse & Response => new StubResponseImpl() as unknown as StubResponse & Response;

export interface StubResponse {
  getSentBody<T>(): T;
  getHeader(name: string): string | string[];
}

export interface StubRequest {
  withParams(params: ParamsDictionary): this;
  withBody(body: any): this;
}

class StubRequestImpl implements StubRequest {
  params: ParamsDictionary = {};
  body: any = {};

  withParams(params: ParamsDictionary): this {
    this.params = params;
    return this;
  }

  withBody(body: any): this {
    this.body = body;
    return this;
  }
}

class StubResponseImpl implements StubResponse {
  private sentBody: any;
  private headers: Record<string, string | string[]> = {};

  statusCode = -1;

  getSentBody(): any {
    return this.sentBody;
  }

  header(name: string, value: string | string[]): this {
    this.headers[name] = value;
    return this;
  }

  getHeader(name: string): string | string[] {
    return this.headers[name];
  }

  contentType(type: string): this {
    this.headers['content-type'] = type.toLowerCase();
    return this;
  }

  send: Send<any, this> = (body: any) => {
    this.sentBody = body;
    return this;
  };

  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  json: Send<any, this> = (body: any) => {
    this.sentBody = body;
    return this;
  };
}
