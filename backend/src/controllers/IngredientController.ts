import { Request, Response, NextFunction } from "express";
import { IngredientService } from "../services/IngredientService";
import BaseController from "../core/BaseController";

export class IngredientController extends BaseController {
  private ingredientService: IngredientService;

  constructor() {
    super();
    this.ingredientService = new IngredientService();

    this.addIngredient = this.addIngredient.bind(this);
    this.getIngredientsByPlate = this.getIngredientsByPlate.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.getAllIngredients = this.getAllIngredients.bind(this);
  }
  async getAllIngredients(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      return this.ingredientService.getAllIngredientsWithPlate();
    });
  }

  async addIngredient(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      return this.ingredientService.create(req.body);
    });
  }

  async getIngredientsByPlate(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      return this.ingredientService.findIngredientsByPlate(req.params.plateId);
    });
  }

  async deleteIngredient(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      return this.ingredientService.delete(req.params.id);
    });
  }
}
