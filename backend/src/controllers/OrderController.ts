import { NextFunction, Request, Response } from "express";
import BaseController from "../core/BaseController";
import OrderService from "../services/OrderService";

class OrderController extends BaseController {
  private orderService: OrderService;
  constructor() {
    super();
    this.orderService = new OrderService();
    this.createOrder = this.createOrder.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.getOrderById = this.getOrderById.bind(this);
  }
  async createOrder(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      const { plateId, quantity } = req.body;
      return this.orderService.createOrder(plateId, quantity);
    });
  }
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      return this.orderService.findAll();
    });
  }
  async getOrderById(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      const { id } = req.params;
      return this.orderService.findById(id);
    });
  }
}
export default OrderController;
