import { Router } from "express";
import { BaseService } from "../services/baseService";
import { PrismaClient, Item } from "@prisma/client";
const router = Router();
class TestService extends BaseService<Item, PrismaClient["item"]> {
  constructor() {
    // testing service
    super(new PrismaClient().item);
  }
}
router.get("/", (req, res) => {
  // testing service

  const testService = new TestService();
  testService
    .create({ name: "test", price: 100, unit: "KG", stock: 10 })
    .then((item) => {
      res.json(item);
    });
  testService.findMany().then((items) => {
    res.json(items);
  });
});

export default router;
