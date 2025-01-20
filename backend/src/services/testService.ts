import { BaseService } from "../core/BaseService";
import { Order } from "@prisma/client";
import prisma from "../models/prismaClient";

class TestService extends BaseService<Order, typeof prisma.order> {
  constructor() {
    super(prisma.order);
  }
}

export default new TestService();
