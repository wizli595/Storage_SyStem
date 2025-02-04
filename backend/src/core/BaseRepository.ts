import prisma from "../models/prismaClient";

/**
 * Generic BaseRepository for handling CRUD operations
 * @template Model - The entity type
 */
export abstract class BaseRepository<Model> {
  protected prisma: typeof prisma;
  protected model: any;

  constructor(model: any) {
    this.prisma = prisma;
    this.model = model;
  }

  /**
   * Create a new record
   */
  async create(data: Partial<Model>): Promise<Model> {
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
  async update(id: string, data: Partial<Model>): Promise<Model> {
    return this.model.update({ where: { id }, data });
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<Model> {
    return this.model.delete({ where: { id } });
  }
}
