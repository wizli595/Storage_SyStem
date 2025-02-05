import { Order } from "@prisma/client";
import { BaseService } from "../core/BaseService";
import OrderRepository from "../repositories/OrderRepository";

class OrderService extends BaseService<Order, OrderRepository> {
  constructor() {
    super(new OrderRepository());
  }
  async createOrder(plateId: string, quantity: number) {
    return this.repository.createOrder(plateId, quantity);
  }
}

export default OrderService;
