import { Router } from "express";
import ItemController from "../controllers/ItemController";
import { itemSchema } from "../validators/ItemValidator";
import { validateRequest } from "../middlewares";
const itemRouter = Router();
const ItemCTL = new ItemController();
itemRouter.post("/", validateRequest(itemSchema), (req, res, next) =>
  ItemCTL.create(req, res, next)
);
itemRouter.get("/", (req, res, next) => ItemCTL.getAll(req, res, next));
itemRouter.get("/:id", (req, res, next) => ItemCTL.getById(req, res, next));

itemRouter.put("/:id", validateRequest(itemSchema), (req, res, next) =>
  ItemCTL.update(req, res, next)
);
itemRouter.delete("/:id", (req, res, next) => ItemCTL.delete(req, res, next));
export default itemRouter;
