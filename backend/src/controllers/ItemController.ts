import { Request, Response, NextFunction } from "express";
import BaseController from "../core/BaseController";
import ItemService from "../services/ItemService";

class ItemController extends BaseController {
  private itemService: ItemService;

  constructor() {
    super();
    this.itemService = new ItemService();
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.itemService.create(req.body)
    );
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const showDeleted = req.query.showDeleted === "true";
    return this.handleRequest(req, res, next, () =>
      this.itemService.findAll(showDeleted)
    );
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.itemService.findById(req.params.id)
    );
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.itemService.update(req.params.id, req.body)
    );
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.itemService.delete(req.params.id)
    );
  }
}
export default ItemController;
