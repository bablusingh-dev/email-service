import jwt from 'jsonwebtoken'
import config from '../configs/config'

export interface JwtPayload {
    userId: number
    email: string
    role: string
}

export interface TokenPair {
    accessToken: string
    refreshToken: string
}

const JWT_SECRET = config.JWT_SECRET
const JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET
const ACCESS_TOKEN_EXPIRY = '30m'
const REFRESH_TOKEN_EXPIRY = '7d'

export function generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY
    })
}

export function generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    })
}

export function generateTokenPair(payload: JwtPayload): TokenPair {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload)
    }
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
}

export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload
}

