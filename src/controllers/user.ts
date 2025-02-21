//Model & bdd
import { User, userCreationAttributes } from "../models/user";
import { Op } from "sequelize";

//Tools
import Crypt from "../tools/hash";
import UUID from "../tools/uuid";
import fs from "fs";
import path from "path";
import config from "config";
import Redis, { KEYS } from "../tools/redis";

const image: number = config.get("storage.nombreImageBanque");
interface passObj {
    password: string;
    newPassword: string;
    confirmPassword: string;
}
class UserController {
    async add(userData: userCreationAttributes) {
        userData.id = UUID.v7();
        userData.image =
            "bank-img-" + Math.trunc(Math.random() * image) + ".png";
        userData.password = "password1";
        userData.isActive = true;
        await User.create(userData);
        userData.password = await Crypt.hash(userData.password);
        await User.update(userData, {
            where: { id: userData.id },
            validate: false,
        });
    }

    async getAll() {
        const users = User.findAll({
            attributes: { exclude: ["password", "token"] },
            order: [["createdAt", "desc"]],
        });
        return users;
    }
}

export default new UserController();
