import { createClient } from "redis";
import config from "config";

class Redis {
    private static instance: Redis;
    private client;
    private expiration: number = config.get("redis.expiration");

    constructor() {
        if (!Redis.instance) {
            this.client = createClient({
                socket: {
                    host: "Abend-redis",
                    port: 6379
                },
                password: "abend-core"
            });

            this.client.on("error", (err) => console.error("Redis : ", err));

            this.client
                .connect()
                .then(() => console.log("   [Redis] ✅ Connecté"))
                .catch((err) => console.error("     [Redis] ❌ Erreur", err));

            Redis.instance = this;
        }
        return Redis.instance;
    }

    getClient() {
        return this.client;
    }

    async setCache(key: string, value: any) {
        await this.client!.set(key, JSON.stringify(value), {
            EX: this.expiration,
        });
    }

    async getCache(key: string) {
        const data = await this.client!.get(key);
        return data ? JSON.parse(data) : null;
    }

    async deleteCache(key: string): Promise<void> {
        await this.client!.del(key);
    }

    async keyExists(key: string): Promise<boolean> {
        const exists = await this.client!.exists(key);
        return exists === 1;
    }
}

export const KEYS = {
    modules: 'modules:all'
};

export default new Redis();
