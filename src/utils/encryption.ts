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
