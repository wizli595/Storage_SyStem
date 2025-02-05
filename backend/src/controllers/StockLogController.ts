import { Request, Response, NextFunction } from "express";
import BaseController from "../core/BaseController";
import StockLogService from "../services/StockLogService";

class StockLogController extends BaseController {
  private stockLogService: StockLogService;

  constructor() {
    super();
    this.stockLogService = new StockLogService();
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.stockLogService.createStockLog(
        req.body.itemId,
        req.body.quantity,
        req.body.actionBy
      )
    );
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.stockLogService.findAll()
    );
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.stockLogService.findById(req.params.id)
    );
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.stockLogService.update(req.params.id, req.body)
    );
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.stockLogService.delete(req.params.id)
    );
  }
  async getByItemId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.stockLogService.findByItemId(req.params.itemId)
    );
  }
}

export default StockLogController;
