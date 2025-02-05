import { StockLog } from "@prisma/client";
import { BaseRepository } from "../core/BaseRepository";
import prismaCLT from "../models/prismaClient";

class StockLogRepository extends BaseRepository<StockLog> {
  constructor() {
    super(prismaCLT.stockLog);
  }
  /**
   * Get stock logs for a specific item
   */
  async findByItemId(itemId: string): Promise<StockLog[]> {
    return this.model.findMany({ where: { itemId } });
  }
}

export default StockLogRepository;
