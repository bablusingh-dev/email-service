import { Timestamps, UserRole } from './common.types'

// ==================== USER ENTITY ====================
export interface User extends Timestamps {
    id: number
    email: string
    passwordHash: string
    name: string
    role: UserRole
    resetToken: string | null
    resetTokenExpiry: Date | null
}

// ==================== USER DTOS ====================
export interface CreateUserDto {
    email: string
    password: string
    name: string
}

export interface LoginDto {
    email: string
    password: string
}

export interface ResetPasswordDto {
    email: string
    resetToken: string
    newPassword: string
}

export interface LoginResponseDto {
    user: {
        id: number
        email: string
        name: string
        role: UserRole
    }
    accessToken: string
    refreshToken: string
    message: string
}
