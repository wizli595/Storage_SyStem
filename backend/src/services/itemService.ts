import prismaCTL from "../models/prismaClient";
import { Item } from "@prisma/client";
import { BaseService } from "../core/BaseService";
import ItemRepository from "../repositories/itemRepository";
import StockLogRepository from "../repositories/StockLogRepository";

class ItemService extends BaseService<Item, ItemRepository> {
  private stockLogRepository: StockLogRepository;
  constructor() {
    super(new ItemRepository());
    this.stockLogRepository = new StockLogRepository();
  }
  /**
   * Get all items , with an optional filter to include deleted items
   * @param showDeleted
   * @returns
   */
  async findAll(showDeleted: boolean = false): Promise<Item[]> {
    return this.repository.findAll({
      where: { isDeleted: showDeleted ? undefined : false },
    });
  }
  /**
   * override update method to include stock log
   * @param id - item id
   * @param data - Updated item data
   * @returns Updated item
   */
  async update(id: string, data: Partial<Item>): Promise<Item> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error("Item not found");
    }

    const stockDifference =
      data.stock !== undefined ? data.stock - item.stock : 0;

    const updatedItem = await this.repository.update(id, data);

    if (stockDifference !== 0 && data.stock !== undefined) {
      await this.stockLogRepository.create({
        itemId: id,
        quantity: stockDifference,
        actionBy: "Admin",
      });
    }
    return updatedItem;
  }
}

export default ItemService;
