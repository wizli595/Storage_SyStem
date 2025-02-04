import prismaCTL from "../models/prismaClient";
import { Item } from "@prisma/client";
import { BaseService } from "../core/BaseService";
import ItemRepository from "../repositories/itemRepository";

class ItemService extends BaseService<Item, typeof ItemRepository> {
  constructor() {
    super(ItemRepository);
  }
}

export default new ItemService();
