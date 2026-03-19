import redis from "../config/redis.config.js"

const userKey = (username) => `user:${username}`
const reserveUsernameKey = (username) => `reserve:username:${username}`
const reserveEmailKey = (email) => `reserve:email:${email}`
const emailKey = (email) => `email:${email}`

export const getUsername = async (username) => {
    try {
        const data = await redis.get(userKey(username))
        return data ? JSON.parse(data) : null
    } catch (err) {
        console.error("Redis username get error:", err)
        return null
    }
}

export const getEmail = async (email) => {
    try {
        const data = await redis.get(emailKey(email))
        return data ? JSON.parse(data) : null
    } catch (err) {
        console.error("Redis email get error:", err)
        return null
    }
}

export const reserveUsername = async (username) => {
    try {
        return await redis.set(
            reserveUsernameKey(username),
            "1",
            "NX",
            "EX",
            30
        )
    } catch (err) {
        console.error("Redis username reserve error:", err)
        return null
    }
}

export const reserveEmail = async (email) => {
    try {
        return await redis.set(
            reserveEmailKey(email),
            "1",
            "NX",
            "EX",
            30
        )
    } catch (err) {
        console.error("Redis email reserve error:", err)
        return null
    }
}

export const releaseUsername = async (username) => {
    try {
        return await redis.del(reserveUsernameKey(username))
    } catch (err) {
        console.error("Redis username release error:", err)
    }
}

export const releaseEmail = async (email) => {
    try {
        return await redis.del(reserveEmailKey(email))
    } catch (err) {
        console.error("Redis email release error:", err)
    }
}

export const saveUserCache = async (username, email) => {
    try {
        const userData = { username, email }

        await redis.set(
            userKey(username),
            JSON.stringify(userData),
            "EX",
            3600
        )

        await redis.set(
            emailKey(email),
            JSON.stringify(userData),
            "EX",
            3600
        )

        return true
    } catch (err) {
        console.error("Redis save error:", err)
        return null
    }
}