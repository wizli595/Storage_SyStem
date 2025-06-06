import { Router } from "express";
import OrderController from "../controllers/OrderController";
import validateOrder from "../validators/OrderValidator";

import { validateRequest } from "../middlewares/validateMiddlewares";

const router = Router();
const orderController = new OrderController();

// Define routes for order operations
/**
 * description: Create a new order
 * tags: [Order]
 */
router.post("/", validateRequest(validateOrder), orderController.createOrder);





/**
 * description: Get all orders
 * tags: [Order]
 */
router.get("/", orderController.getAllOrders);
/**
 * description: Get an order by ID
 * tags: [Order]
 */
router.get("/:id", orderController.getOrderById);

export default router;
