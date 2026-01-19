import RepositoryFactory from '../repositories/RepositoryFactory'
import { CreateUserDto, LoginDto, ResetPasswordDto, LoginResponseDto, User } from '../types/user.types'
import { AppError } from '../utils/appError'
import { hashPassword, comparePassword, generateResetToken } from '../utils/password'
import { generateTokenPair } from '../utils/jwt'

class UserService {
    private userRepository = RepositoryFactory.getUserRepository()

    async signup(data: CreateUserDto): Promise<{ message: string }> {
        const userCount = await this.userRepository.count()
        if (userCount > 0) {
            throw new AppError('User already exists. Only one admin user is allowed.', 409, 'USER_EXISTS')
        }

        const existingUser = await this.userRepository.findByEmail(data.email)
        if (existingUser) {
            throw new AppError('User with this email already exists', 409, 'USER_EXISTS')
        }

        const passwordHash = await hashPassword(data.password)

        await this.userRepository.create({
            email: data.email,
            password: passwordHash,
            name: data.name
        })

        return { message: 'Admin user created successfully' }
    }

    async login(data: LoginDto): Promise<LoginResponseDto> {
        const user = await this.userRepository.findByEmail(data.email)
        if (!user) {
            throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
        }

        const isPasswordValid = await comparePassword(data.password, user.passwordHash)
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
        }

        const tokens = generateTokenPair({
            userId: user.id,
            email: user.email,
            role: user.role
        })

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            message: 'Login successful'
        }
    }

    async initiatePasswordReset(email: string): Promise<{ resetToken: string; message: string }> {
        const user = await this.userRepository.findByEmail(email)
        if (!user) {
            throw new AppError('User not found', 404, 'USER_NOT_FOUND')
        }

        const resetToken = generateResetToken()
        const expiry = new Date(Date.now() + 3600000)

        await this.userRepository.setResetToken(user.id, resetToken, expiry)

        return {
            resetToken,
            message: 'Password reset token generated. Use this token to reset your password.'
        }
    }

    async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
        const user = await this.userRepository.findByEmail(data.email)
        if (!user) {
            throw new AppError('User not found', 404, 'USER_NOT_FOUND')
        }

        if (!user.resetToken || user.resetToken !== data.resetToken) {
            throw new AppError('Invalid reset token', 400, 'INVALID_TOKEN')
        }

        if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            throw new AppError('Reset token has expired', 400, 'TOKEN_EXPIRED')
        }

        const passwordHash = await hashPassword(data.newPassword)
        await this.userRepository.updatePasswordHash(user.id, passwordHash)
        await this.userRepository.clearResetToken(user.id)

        return { message: 'Password reset successfully' }
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.findByEmail(email)
    }
    async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findById(id)
    }
}

export default new UserService()

