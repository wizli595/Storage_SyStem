import prismaCTL from "../models/prismaClient";
import { BaseRepository } from "../core/BaseRepository";
import { Item } from "@prisma/client";
import { de } from "@faker-js/faker/.";

class ItemRepository extends BaseRepository<Item> {
  constructor() {
    super(prismaCTL.item);
  }
}

export default new ItemRepository();
