import Redis from "ioredis";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ── In-Memory Local Cache (Server-side, inaccessible to frontend JavaScript) ──
class LocalCacheStore {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttlSeconds = 3600) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  del(key) {
    this.store.delete(key);
  }

  has(key) {
    return this.get(key) !== null;
  }
}

const localCache = new LocalCacheStore();

// ── Redis Client with Resilient Fallback ──
let redisClient = null;
let isRedisAvailable = false;

if (process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 3) return null; // stop retrying after 3 attempts
        return Math.min(times * 1000, 3000);
      },
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    redisClient.connect().then(() => {
      isRedisAvailable = true;
      console.log("⚡ Connected to Redis successfully!");
    }).catch((err) => {
      isRedisAvailable = false;
      console.warn(`⚠️  Redis unavailable (${err.message}). Using secure server localCache fallback.`);
    });

    redisClient.on("error", () => {
      isRedisAvailable = false;
    });

    redisClient.on("ready", () => {
      isRedisAvailable = true;
    });
  } catch (e) {
    console.warn("⚠️  Redis initialization skipped. Using localCache.");
  }
}

// ── Unified Cache Interface ──
export const cache = {
  async set(key, value, ttlSeconds = 3600) {
    const stringified = typeof value === "string" ? value : JSON.stringify(value);
    localCache.set(key, value, ttlSeconds);

    if (isRedisAvailable && redisClient) {
      try {
        await redisClient.set(key, stringified, "EX", ttlSeconds);
      } catch (err) {
        // Fallback is already handled by localCache
      }
    }
  },

  async get(key) {
    if (isRedisAvailable && redisClient) {
      try {
        const val = await redisClient.get(key);
        if (val) {
          try {
            return JSON.parse(val);
          } catch {
            return val;
          }
        }
      } catch (err) {
        // Fall back to localCache
      }
    }
    return localCache.get(key);
  },

  async del(key) {
    localCache.del(key);
    if (isRedisAvailable && redisClient) {
      try {
        await redisClient.del(key);
      } catch (err) {}
    }
  },

  // Token management
  async storeSession(token, sessionData, ttlSeconds = 7 * 24 * 3600) {
    await this.set(`session:${token}`, sessionData, ttlSeconds);
  },

  async getSession(token) {
    return await this.get(`session:${token}`);
  },

  async revokeSession(token) {
    await this.del(`session:${token}`);
    await this.set(`blacklist:${token}`, true, 7 * 24 * 3600);
  },

  async isTokenBlacklisted(token) {
    const res = await this.get(`blacklist:${token}`);
    return Boolean(res);
  },

  // Pending Secret / OTP challenge session
  async storePendingChallenge(sessionId, data, ttlSeconds = 600) {
    await this.set(`challenge:${sessionId}`, data, ttlSeconds);
  },

  async getPendingChallenge(sessionId) {
    return await this.get(`challenge:${sessionId}`);
  },

  async consumePendingChallenge(sessionId) {
    const data = await this.get(`challenge:${sessionId}`);
    if (data) {
      await this.del(`challenge:${sessionId}`);
    }
    return data;
  },
};

export default cache;
