import { StockLog } from "@prisma/client";
import { BaseService } from "../core/BaseService";
import StockLogRepository from "../repositories/StockLogRepository";
import itemRepository from "../repositories/ItemRepository";

class StockLogService extends BaseService<StockLog, StockLogRepository> {
  private itemRepository: itemRepository;
  constructor() {
    super(new StockLogRepository());
    this.itemRepository = new itemRepository();
  }
  /**
   * Create a stock log entry and update item stock.
   */
  async createStockLog(
    itemId: string,
    quantity: number,
    actionBy: string
  ): Promise<StockLog> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new Error("Item not found");

    const newStock = item.stock + quantity;
    await this.itemRepository.update(itemId, { stock: newStock });

    return this.repository.create({
      itemId,
      quantity,
      actionBy,
    });
  }
  async findAll(): Promise<StockLog[]> {
    return this.repository.findAll({ include: { item: true } });
  }

  /**
   * Get stock logs for a specific item
   */
  async findByItemId(itemId: string): Promise<StockLog[]> {
    return this.repository.findByItemId(itemId);
  }
}

export default StockLogService;
