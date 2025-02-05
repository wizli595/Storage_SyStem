import { Router } from "express";
import { StockRequestController } from "../controllers/StockRequestController";
import stockRequestValidator from "../validators/StockRequestValidator";
import { validateRequest } from "../middlewares/validateMiddlewares";

const router = Router();
const stockRequestController = new StockRequestController();

router.get("/", stockRequestController.getAllStockRequests);
router.put("/:id/:action", stockRequestController.updateStockRequest);
router.post(
  "/",
  validateRequest(stockRequestValidator),
  stockRequestController.createStockRequest
);
// router.put("/:id/approve", stockRequestController.approveStockRequest);
// router.put("/:id/reject", stockRequestController.rejectStockRequest);
// router.put("/:id/issue", stockRequestController.issueStockRequest);

export default router;
