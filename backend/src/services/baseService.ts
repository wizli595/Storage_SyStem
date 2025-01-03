import { PrismaClient, Prisma } from "@prisma/client";

/**
 * Generic BaseService for Prisma models
 * @template Model - The Prisma model type
 * @template Delegate - The Prisma delegate type
 */

export abstract class BaseService<
  Model,
  Delegate extends {
    create: Function;
    findUnique: Function;
    findMany: Function;
    update: Function;
    delete: Function;
  }
> {
  protected prisma: PrismaClient;
  protected model: Delegate;

  constructor(model: Delegate) {
    this.prisma = new PrismaClient();
    this.model = model;
  }

  /**
   * Create a new record
   */
  async create(
    data: Parameters<Delegate["create"]>[0]["data"]
  ): Promise<Model> {
    return this.model.create({ data });
  }

  /**
   * Find a record by ID
   */
  async findById(id: string): Promise<Model | null> {
    return this.model.findUnique({ where: { id } });
  }

  /**
   * Get all records
   */
  async findAll(): Promise<Model[]> {
    return this.model.findMany();
  }

  /**
   * Update a record by ID
   */
  async update(
    id: string,
    data: Parameters<Delegate["update"]>[0]["data"]
  ): Promise<Model | null> {
    return this.model.update({ where: { id }, data });
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
