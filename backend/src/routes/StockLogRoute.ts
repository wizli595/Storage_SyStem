import { Router } from "express";
import StockLogController from "../controllers/StockLogController";
import { validateRequest } from "../middlewares";
import { stockLogSchema } from "../validators/StockLogValidator";

const router = Router();
const StockLogCTL = new StockLogController();

router.get("/", (req, res, nex) => StockLogCTL.getAll(req, res, nex));
router.get("/:id", (req, res, nex) => StockLogCTL.getById(req, res, nex));
router.get("/item/:itemId", (req, res, nex) =>
  StockLogCTL.getByItemId(req, res, nex)
);

export default router;
