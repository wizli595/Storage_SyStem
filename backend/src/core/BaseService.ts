import { BaseRepository } from "./BaseRepository";

/**
 * Generic BaseService for handling business logic
 * @template Model - The entity type
 * @template Repository - The repository handling database operations
 */
export abstract class BaseService<
  Model,
  Repository extends BaseRepository<Model>
> {
  protected repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  /**
   * Create a new record using the repository
   */
  async create(data: Partial<Model>): Promise<Model> {
    return this.repository.create(data);
  }

  /**
   * Find a record by ID
   */
  async findById(id: string): Promise<Model | null> {
    return this.repository.findById(id);
  }

  /**
   * Get all records
   */
  async findAll(): Promise<Model[]> {
    return this.repository.findAll();
  }

  /**
   * Update a record by ID
   */
  async update(id: string, data: Partial<Model>): Promise<Model> {
    return this.repository.update(id, data);
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<Model> {
    return this.repository.delete(id);
  }
}
