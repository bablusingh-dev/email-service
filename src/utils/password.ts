import crypto from 'node:crypto'

/**
 * Password Utilities
 *
 * Provides bcrypt-style password hashing using Node.js crypto module
 * to avoid additional dependencies
 */


/**
 * Hash a password using PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex')
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err)
            resolve(salt + ':' + derivedKey.toString('hex'))
        })
    })
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(':')
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err)
            resolve(key === derivedKey.toString('hex'))
        })
    })
}

/**
 * Generate a random reset token
 */
export function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex')
}
