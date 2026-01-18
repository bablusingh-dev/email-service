import { IBaseRepository } from './IBaseRepository.js'
import { User, CreateUserDto } from '../../types/user.types.js'

/**
 * User repository interface
 * Extends base repository with user-specific methods
 */
export interface IUserRepository extends IBaseRepository<User, CreateUserDto, Partial<User>> {
    /**
     * Find a user by email
     */
    findByEmail(email: string): Promise<User | null>

    /**
     * Find a user by reset token
     */
    findByResetToken(resetToken: string): Promise<User | null>

    /**
     * Update user password hash
     */
    updatePasswordHash(id: number, passwordHash: string): Promise<User | null>

    /**
     * Set reset token and expiry
     */
    setResetToken(id: number, resetToken: string, expiry: Date): Promise<User | null>

    /**
     * Clear reset token
     */
    clearResetToken(id: number): Promise<User | null>
}
