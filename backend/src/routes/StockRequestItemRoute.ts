import { Router } from "express";
import { StockRequestItemController } from "../controllers/StockRequestItemController";
import {
  approveSchema,
  issueSchema,
} from "../validators/StockRequestItemValidator";
import { validateRequest } from "../middlewares/validateMiddlewares";

const router = Router();
const stockRequestItemController = new StockRequestItemController();

router.get(
  "/request/:requestId",
  stockRequestItemController.getStockRequestItems
);
router.put(
  "/:id/approve",
  validateRequest(approveSchema),
  stockRequestItemController.approveItem
);
router.put(
  "/:id/issue",
  validateRequest(issueSchema),
  stockRequestItemController.issueItem
);

export default router;
