// tools
import Crypt from "../tools/hash";
// Db & Model
import db from "./db";
import { User } from "../models/user";
import config from "config";
import Redis, { KEYS } from "../tools/redis";

const image: number = config.get("storage.nombreImageBanque");
const env = config.get("server.env");

// Data
const dataUser = require("./data/user");

// Fonction d'initialisation exportée
export async function initializeDatabase(force: boolean = false) {
    try {
        if (env === "Dev" || env === "Test") {
            await db.abend!.sync({ force });
            await pushDb_dev();
        } else {
            await db.abend!.sync({ alter: true });
        }
    } catch (err) {
        console.log("Erreur de synchronisation :", err);
        throw err; // Relance l'erreur pour les tests
    }
}

async function pushDb_dev() {
    try {
        Redis.deleteCache(KEYS.modules);
        console.log("");
        console.log("Début de synchronisation...");
        console.log("");
        await initUsers();
        console.log("");
        console.log("Synchronisation terminée !");
    } catch (err) {
        console.error("Erreur :", err);
        throw err;
    }
}

async function initUsers() {
    for (const data of dataUser.users) {
        if (data.image == undefined) {
            data.image =
                "bank-img-" + Math.trunc(Math.random() * image) + ".png";
        }
        await User.create(data);
        data.password = await Crypt.hash(data.password);
        await User.update(data, {
            where: { id: data.id },
            validate: false,
        });
    }
    console.log("   - ✅ Utilisateurs");
}

