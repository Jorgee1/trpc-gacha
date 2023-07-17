import { db } from '../db.js'
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto'

import type { User } from '@prisma/client'

const iterations = 320000
const keylen = 32
const saltlen = 20
const digest = 'sha512'

type createUserParams = {username: string, password: string}


const generateHashAndSalt = (password: string) => {
    const salt = randomBytes(saltlen).toString('base64')
    const passwordHash = pbkdf2Sync(password, salt, iterations, keylen, digest).toString('base64')
    return {salt, passwordHash}
}

export const createUser = async ({username, password}: createUserParams) => {
    const { salt, passwordHash } = generateHashAndSalt(password)

    const user = await db.user.create({data: {username}})
    await db.hash.create({data: {
        userId: user.id,
        passwordHash,
        digest,
        iterations,
        keylen,
        salt
    }})

    return user
}

export const deleteUser = async (id: string) => {
    const user = await db.user.findUnique({where: {id}, include: {hash: true, session: true}})

    if (!user) return false

    if (user.hash) await db.hash.delete({where: {userId: id}})
    if (user.session) await db.session.delete({where: {userId: id}})

    await db.user.delete({where: {id}})

    return true
}

export const checkPassword = async ({user, passwordToCheck}: {user: User, passwordToCheck: string}) => {
    const hash = await db.hash.findUniqueOrThrow({where: {userId: user.id}})
    
    const passwordToCheckHash = pbkdf2Sync(passwordToCheck, hash.salt, hash.iterations, hash.keylen, hash.digest)

    return timingSafeEqual(Buffer.from(hash.passwordHash, 'base64'), passwordToCheckHash)
}

export const changePassword = async ({user, password, newPassword}: {user: User, password: string, newPassword: string}) => {

    if (!await checkPassword({user, passwordToCheck: password})) return false

    const { salt, passwordHash } = generateHashAndSalt(newPassword)

    await db.hash.update({where: {userId: user.id}, data: {
        passwordHash,
        digest,
        iterations,
        keylen,
        salt
    }})
    return true
}