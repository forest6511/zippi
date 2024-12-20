import { createClient } from 'redis'

let client: ReturnType<typeof createClient>

async function initializeRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    })

    client.on('error', (err) => console.error('Redis Client Error', err))
    await client.connect()
  }
  console.log('Initialize Redis Client Successfully')
  return client
}

export { initializeRedisClient }
