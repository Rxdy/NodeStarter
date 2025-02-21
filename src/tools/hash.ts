import bcrypt from "bcryptjs";
import crypto, { randomBytes } from "crypto";

class Crypt {
    async hash(value: string): Promise<string> {
        const data = await bcrypt.hash(value, 10);
        return data;
    }

    async compare(value: string, valueHash: string): Promise<boolean> {
        const data = await bcrypt.compare(value, valueHash);
        return data;
    }

    generateKey(login: string) {
        return crypto.createHash("sha256").update(login).digest();
    }

    encrypt(value: string, login: string) {
        const secretKey = this.generateKey(login);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
        let encrypted = cipher.update(value, "utf8", "hex");
        encrypted += cipher.final("hex");

        return iv.toString("hex") + ":" + encrypted;
    }

    decrypt(value: string, login: string) {
        const secretKey = this.generateKey(login);
        const [ivHex, dataHex] = value.split(":");
        const iv = Buffer.from(ivHex, "hex");

        const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
        let decrypted = decipher.update(dataHex, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    }

    encryptObj(obj: Record<string, string>, login: string) {
        for (const property in obj) {
            if (typeof obj[property] == "string") {
                obj[property] = this.encrypt(obj[property], login);
            }
        }
        return obj;
    }
    decryptObj(obj: Record<string, string>, login: string) {
        for (const property in obj) {
            if (typeof obj[property] != "boolean") {
                obj[property] = this.decrypt(obj[property], login);
            }
        }
        return obj;
    }

    genToken(length: number) {
        return randomBytes(length).toString("hex");
    }
}

export default new Crypt();
