import { Request, RequestHandler, Response } from 'express';
import { logger } from '../../logger';

export interface ResponseFormat {
  status: 'success' | 'failure';
  code: number;
  data: { [index: string]: unknown } | null;
}

export enum RequestMethods {
  GET = 'get',
  POST = 'post',
}

export abstract class BaseController {
  abstract path: string;
  abstract method: RequestMethods;
  abstract middleware?: RequestHandler[];

  protected abstract executeImpl(req: Request, res: Response): Promise<void | unknown>;

  async execute(req: Request, res: Response): Promise<void> {
    try {
      await this.executeImpl(req, res);
    } catch (err) {
      logger.error(err);
      this.fail(res, `An unexpected error occurred`);
    }
  }

  static jsonResponse(res: Response, code: number, message: string) {
    if (code >= 400 && process.env.NODE_ENV === 'development') {
      logger.error(message);
    }

    const responseData: ResponseFormat = {
      status: code >= 400 ? 'failure' : 'success',
      code,
      data: { message },
    };

    return res.status(code).json(responseData);
  }

  ok<T>(res: Response, dto?: T) {
    const responseData: ResponseFormat = {
      status: 'success',
      code: 200,
      data: dto || null,
    };

    return res.status(200).json(responseData);
  }

  created(res: Response) {
    return BaseController.jsonResponse(res, 201, 'Created');
  }

  clientError(res: Response, message = 'Bad request') {
    return BaseController.jsonResponse(res, 400, message);
  }

  unauthorized(res: Response, message = 'Unauthorized') {
    return BaseController.jsonResponse(res, 401, message);
  }

  forbidden(res: Response, message = 'Forbidden') {
    return BaseController.jsonResponse(res, 403, message);
  }

  notFound(res: Response, message = 'Not found') {
    return BaseController.jsonResponse(res, 404, message);
  }

  tooMany(res: Response, message = 'Too many requests') {
    return BaseController.jsonResponse(res, 429, message);
  }

  gone(res: Response, message = 'Gone') {
    return BaseController.jsonResponse(res, 410, message);
  }

  fail(res: Response, error: Error | string) {
    logger.error(error);

    const responseData: ResponseFormat = {
      status: 'failure',
      code: 500,
      data: { message: error.toString() },
    };

    return res.status(500).json(responseData);
  }
}
