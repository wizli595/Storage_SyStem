import { NextFunction, Request, Response } from "express";
import BaseController from "../core/BaseController";
import PlateService from "../services/PlateService";

class PlateController extends BaseController {
  private plateService: PlateService;
  constructor() {
    super();
    this.plateService = new PlateService();
    this.createPlate = this.createPlate.bind(this);
    this.getPlates = this.getPlates.bind(this);
    this.getPlateById = this.getPlateById.bind(this);
    this.updatePlate = this.updatePlate.bind(this);
    this.deletePlate = this.deletePlate.bind(this);
  }

  async createPlate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.plateService.create(req.body)
    );
  }

  async getPlates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.plateService.findAll()
    );
  }
  async getPlateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.plateService.findById(req.params.id)
    );
  }

  async updatePlate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.plateService.update(req.params.id, req.body)
    );
  }

  async deletePlate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return this.handleRequest(req, res, next, () =>
      this.plateService.delete(req.params.id)
    );
  }
}

export default PlateController;
