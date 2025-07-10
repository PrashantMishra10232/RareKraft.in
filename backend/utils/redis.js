import 'dotenv/config';
import Redis from 'ioredis';

// console.log("REDIS_HOST:", process.env.REDIS_HOST);
// console.log("REDIS_PORT:", process.env.REDIS_PORT);
// console.log("REDIS_USERNAME:", process.env.REDIS_USERNAME);
// console.log("REDIS_PASSWORD:", process.env.REDIS_PASSWORD);


const redis = new Redis({
    host: process.env.REDIS_HOST,
    port:Number(process.env.REDIS_PORT) || 19721,
    username:process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD,
})

// const redis = new Redis(process.env.REDIS_URI)

redis.set("testKey", "hello", (err) => {
  if (err) console.error("Set failed:", err);
  else console.log("Redis is working!");
});


redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;