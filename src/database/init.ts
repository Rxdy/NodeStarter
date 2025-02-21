//tools
import Crypt from "../tools/hash";
//Db & Model
import db from "./db";
import { User } from "../models/user";
import config from "config";
import Redis, { KEYS } from "../tools/redis";

const image: number = config.get("storage.nombreImageBanque");
const env = config.get("server.env");

//Data
const dataUser = require("./data/user");
const dataModule = require("./data/module");

let lastUUID: string;
if (env == "Dev") {
    db.abend
        .sync({ force: true })
        .then(async (_) => {
            pushDb_dev();
        })
        .catch((err) => {
            console.log("Erreur de synchronisation :", err);
        });
} else {
    db.abend
        .sync({ alter: true })
        .then(async (_) => {})
        .catch((err) => {
            console.log("Erreur de synchronisation :", err);
        });
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

