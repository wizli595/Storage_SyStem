import { PrismaClient } from "@prisma/client";

/**
 * Generic BaseService for Prisma models
 * @template Model - The Prisma model type
 * @template Delegate - The Prisma delegate type
 */
export abstract class BaseService<
  Model,
  Delegate extends {
    create: (args: any) => Promise<Model>;
    findUnique: (args: any) => Promise<Model | null>;
    findMany: (args?: any) => Promise<Model[]>;
    update: (args: any) => Promise<Model>;
    delete: (args: any) => Promise<Model>;
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
  async create<T extends Parameters<Delegate["create"]>[0]>(
    data: T["data"]
  ): Promise<Model> {
    return this.model.create({ data });
  }

  /**
   * Find a record by ID
   */
  async findUnique<T extends Parameters<Delegate["findUnique"]>[0]>(
    where: T["where"]
  ): Promise<Model | null> {
    return this.model.findUnique({ where });
  }

  /**
   * Get all records
   */
  async findMany<T extends Parameters<Delegate["findMany"]>[0]>(
    args?: T
  ): Promise<Model[]> {
    return this.model.findMany(args);
  }

  /**
   * Update a record by ID
   */
  async update<T extends Parameters<Delegate["update"]>[0]>(
    where: T["where"],
    data: T["data"]
  ): Promise<Model> {
    return this.model.update({ where, data });
  }

  /**
   * Delete a record by ID
   */
  async delete<T extends Parameters<Delegate["delete"]>[0]>(
    where: T["where"]
  ): Promise<Model> {
    return this.model.delete({ where });
  }
}
