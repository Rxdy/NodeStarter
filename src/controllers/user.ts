//Model & bdd
import { User, userCreationAttributes } from "../models/user";

//Tools
import Crypt from "../tools/hash";
import UUID from "../tools/uuid";
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
        userData.password = "password1";
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
