import { PaginationParams, PaginatedResponse } from '../../types/common.types.js'

/**
 * Base repository interface defining common CRUD operations
 * All specific repositories should extend this interface
 */
export interface IBaseRepository<T, CreateDto, UpdateDto> {
    /**
     * Find a single record by ID
     */
    findById(id: number): Promise<T | null>

    /**
     * Find all records with optional pagination
     */
    findAll(params?: PaginationParams): Promise<PaginatedResponse<T>>

    /**
     * Create a new record
     */
    create(data: CreateDto): Promise<T>

    /**
     * Update an existing record
     */
    update(id: number, data: UpdateDto): Promise<T | null>

    /**
     * Delete a record by ID
     */
    delete(id: number): Promise<boolean>

    /**
     * Count total records
     */
    count(): Promise<number>
}
