import RedisStore from "connect-redis";
import { createClient } from "redis";
import "dotenv/config";
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient
  .connect()
  .then(() => {
    console.log("Redis Connect");
  })
  .catch((err) => {
    console.error("Error connecting to redis", err.message);
  });

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "session:blueeye",
});
export default redisStore;
