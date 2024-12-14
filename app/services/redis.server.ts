import { createClient } from 'redis';

// Redisクライアントの作成
const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', err => console.error('Redis Client Error', err));

// 接続処理
await client.connect();

export { client };