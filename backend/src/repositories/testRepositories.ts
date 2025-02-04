import { Order } from "@prisma/client";
import prismaCLT from "../models/prismaClient";
import { BaseRepository } from "../core/BaseRepository";

class TestRepository extends BaseRepository<Order> {
  constructor() {
    super(prismaCLT.order);
  }

  // Example custom query
  async findByName(name: string): Promise<Order | null> {
    return this.model.findFirst({ where: { name } });
  }
  async findAll(): Promise<Order[]> {
    return this.model.findMany();
  }
}

export default new TestRepository();
