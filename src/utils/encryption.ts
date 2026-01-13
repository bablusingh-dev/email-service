import crypto from 'node:crypto'
import config from '../configs/config'

const ALGORITHM = 'aes-256-cbc'
const ENCRYPTION_KEY = config.ENCRYPTION_KEY
const IV_LENGTH = 16

/**
 * Encryption Utilities
 *
 * Provides AES-256-CBC encryption for provider API keys
 * and SHA-256 hashing for API keys
 */

/**
 * Encrypt text using AES-256-CBC
 * Used for encrypting provider API keys before storing in database
 */
export function encrypt(text: string): string {
    if (!validateEncryptionKey()) {
        throw new Error('Invalid encryption key')
    }
    const key = Buffer.from(ENCRYPTION_KEY!.padEnd(32, '0').slice(0, 32))
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    // Return IV + encrypted data
    return iv.toString('hex') + ':' + encrypted
}

/**
 * Decrypt text using AES-256-CBC
 * Used for decrypting provider API keys when needed
 */
export function decrypt(encryptedText: string): string {
    if (!validateEncryptionKey()) {
        throw new Error('Invalid encryption key')
    }
    const key = Buffer.from(ENCRYPTION_KEY!.padEnd(32, '0').slice(0, 32))
    const parts = encryptedText.split(':')

    if (parts.length !== 2) {
        throw new Error('Invalid encrypted text format')
    }

    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}

/**
 * Validate encryption key format
 */
export function validateEncryptionKey(): boolean {
    if (!config.ENCRYPTION_KEY) {
        return false
    }

    if (config.ENCRYPTION_KEY.length < 32) {
        return false
    }

    return true
}

/**
 * Hash text using SHA-256
 * Used for hashing API keys before storing in database
 */
export function hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex')
}

/**
 * Generate a random API key with the specified prefix
 * Format: prefix_base64urlRandomBytes
 */
export function generateApiKey(prefix: string = 'eqs_'): string {
    const randomBytes = crypto.randomBytes(32)
    const base64url = randomBytes.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

    return `${prefix}${base64url}`
}

/**
 * Extract the prefix from an API key (first 8 characters)
 * Used for display and quick lookup
 */
export function extractKeyPrefix(apiKey: string): string {
    return apiKey.slice(0, 12) // eqs_ + 8 chars
}
