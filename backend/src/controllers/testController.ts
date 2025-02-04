import { NextFunction, Request, Response } from "express";
import BaseController from "../core/BaseController";
import testService from "../services/testService";

class testController extends BaseController {
  async getAllTest(req: Request, res: Response, next: NextFunction) {
    await this.handleRequest(req, res, next, async () => {
      return await testService.findAll();
    });
  }
}

export default new testController();
