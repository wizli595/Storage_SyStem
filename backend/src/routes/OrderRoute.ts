import { Router } from "express";
import OrderController from "../controllers/OrderController";
import validateOrder from "../validators/OrderValidator";

import { validateRequest } from "../middlewares/validateMiddlewares";

const router = Router();
const orderController = new OrderController();

router.post("/", validateRequest(validateOrder), orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);

export default router;
