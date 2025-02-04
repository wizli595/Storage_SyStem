import { Router } from "express";
import ItemController from "../controllers/itemController";
import { itemSchema } from "../validators/itemValidator";
import { validateRequest } from "../middlewares";
const itemRouter = Router();
itemRouter.post("/", validateRequest(itemSchema), (req, res, next) =>
  ItemController.create(req, res, next)
);
itemRouter.get("/", (req, res, next) => ItemController.getAll(req, res, next));
itemRouter.get("/:id", (req, res, next) =>
  ItemController.getById(req, res, next)
);
export default itemRouter;
