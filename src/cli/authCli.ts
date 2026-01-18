#!/usr/bin/env node
/* eslint-disable no-console */

import 'source-map-support/register'
import '../configs/config'
// import { connectDatabase } from '../database/db'
import userService from '../services/userService'
import { createUserSchema, resetPasswordSchema } from '../validators/schema'

const args = process.argv.slice(2)
const command = args[0]

async function signup() {
    try {
        if (args.length < 4) {
            console.error('Usage: npm run cli:signup <email> <password> <name>')
            process.exit(1)
        }

        const [, email, password, name] = args

        const value = await createUserSchema.validateAsync({ email, password, name })
        const result = await userService.signup(value)

        console.log(`\n✓ ${result.message}`)
        console.log(`  Email: ${email}`)
        console.log(`  Name: ${name}\n`)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`\n✗ Signup failed: ${error.message}\n`)
        } else {
            console.error(`\n✗ Signup failed: Unknown error\n`)
        }
        process.exit(1)
    }
}

async function resetPassword() {
    try {
        if (args.length < 2) {
            console.error('Usage: npm run cli:reset-init <email>')
            console.error('   or: npm run cli:reset-complete <email> <resetToken> <newPassword>')
            process.exit(1)
        }

        if (args[0] === 'reset-init') {
            const email = args[1]
            const result = await userService.initiatePasswordReset(email)
            console.log(`\n✓ ${result.message}`)
            console.log(`  Reset Token: ${result.resetToken}`)
            console.log(`  This token will expire in 1 hour.\n`)
        } else if (args[0] === 'reset-complete') {
            if (args.length < 4) {
                console.error('Usage: npm run cli:reset-complete <email> <resetToken> <newPassword>')
                process.exit(1)
            }

            const [, email, resetToken, newPassword] = args
            const value = await resetPasswordSchema.validateAsync({ email, resetToken, newPassword })
            const result = await userService.resetPassword(value)

            console.log(`\n✓ ${result.message}\n`)
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`\n✗ Password reset failed: ${error.message}\n`)
        } else {
            console.error(`\n✗ Password reset failed: Unknown error\n`)
        }
        process.exit(1)
    }
}

async function main() {
    switch (command) {
        case 'signup':
            await signup()
            break
        case 'reset-init':
        case 'reset-complete':
            await resetPassword()
            break
        default:
            console.error('\nAvailable commands:')
            console.error('  npm run cli:signup <email> <password> <name>')
            console.error('  npm run cli:reset-init <email>')
            console.error('  npm run cli:reset-complete <email> <resetToken> <newPassword>\n')
            process.exit(1)
    }

    process.exit(0)
}

main().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
})
