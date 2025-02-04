import { BaseService } from "../core/BaseService";
import TestRepository from "../repositories/testRepositories";
import { Order } from "@prisma/client";

class TestService extends BaseService<Order, typeof TestRepository> {
  constructor() {
    super(TestRepository);
  }

  /**
   * Example: Ensure unique test name before creating
   */
  // async createTest(data: Partial<Order>): Promise<Order> {
  //   const existingTest = await this.repository.findByName(data.name!);
  //   if (existingTest) throw new Error("Test with this name already exists");

  //   return this.repository.create(data);
  // }

  /**
   * Example: get all tests
   */
  async getAllTests(): Promise<Order[]> {
    return this.repository.findAll();
  }
}

export default new TestService();
