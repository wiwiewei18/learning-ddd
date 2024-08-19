import { Request, RequestHandler, Response } from 'express';
import { BaseController, RequestMethods, ResponseFormat } from './BaseController';
import { stubRequest, stubResponse } from './tests/stubs/http';

class TestController extends BaseController {
  path: string = '/';
  method: RequestMethods = RequestMethods.GET;
  middleware?: RequestHandler[] | undefined;

  async executeImpl(req: Request, res: Response): Promise<unknown> {
    if (req.body.isOk) {
      return this.ok(res);
    }

    if (req.body.isCreated) {
      return this.created(res);
    }

    return this.fail(res, `error`);
  }
}

describe('BaseController', () => {
  let testController: TestController;

  beforeEach(() => {
    testController = new TestController();
  });

  describe('success JSON response', () => {
    it('should provide standardized success ok JSON response', async () => {
      const request = stubRequest();
      const response = stubResponse();

      await testController.execute(request.withBody({ isOk: true }), response);

      expect(response.statusCode).toEqual(200);
      const sent = response.getSentBody() as ResponseFormat;
      expect(sent.status).toBe('success');
      expect(sent.code).toEqual(200);
      expect(sent.data).toBeDefined();
    });

    it('should provide standardized success created JSON response', async () => {
      const request = stubRequest();
      const response = stubResponse();

      await testController.execute(request.withBody({ isCreated: true }), response);

      expect(response.statusCode).toEqual(201);
      const sent = response.getSentBody() as ResponseFormat;
      expect(sent.status).toBe('success');
      expect(sent.code).toEqual(201);
      expect(sent.data).toBeDefined();
    });
  });

  describe('failure JSON response', () => {
    it('should provide standardized failed JSON response', async () => {
      const request = stubRequest();
      const response = stubResponse();

      await testController.execute(request, response);

      expect(response.statusCode).toBeGreaterThanOrEqual(400);

      const sent = response.getSentBody() as ResponseFormat;
      expect(sent.status).toBe('failure');
      expect(sent.code).toBeGreaterThanOrEqual(400);
      expect(sent.data).toBeDefined();
    });
  });
});
