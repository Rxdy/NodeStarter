import { User, userCreationAttributes } from "../models/user";
import Crypt from "../tools/hash";
interface passObj {
    password: string;
    newPassword: string;
    confirmPassword: string;
}

class UserValidator {
    async data(userData: Partial<userCreationAttributes>) {
        if (userData.username) {
            const username = await this.#findUsername(userData.username);
            if (username) {
                return "Cet identifiant est déjà utilisé.";
            }
            if (userData.username.length < 3 || userData.username.length > 15) {
                return "L'identifiant doit faire entre 3 et 15 caractères.";
            }
        }

        if (userData.mail) {
            const mail = await this.#findMail(userData.mail);
            if (mail) {
                return "Ce mail est déjà utilisé par un autre compte.";
            }
        }
    }

    async found(userId: string) {
        const user = await User.findByPk(userId);
        return user;
    }

    async password(data: passObj, userId: string) {
        const user = await User.findByPk(userId);
        const validPassword = await Crypt.compare(
            data.password,
            user!.password
        );

        if (data.newPassword.length <= 8) {
            return "Le mot de passe doit contenir plus de 8 caractères.";
        }
        if (data.newPassword != data.confirmPassword) {
            return "Les mots de passe ne sont pas identiques.";
        }
        if (!validPassword) {
            return "Erreur dans la saisie du mot de passe.";
        }
    }

    async hasFile(file: Express.Multer.File) {
        if (!file) {
            return "Aucun fichier téléchargé.";
        }
    }

    async #findMail(mail: string) {
        const res = await User.findOne({ where: { mail: mail } });
        return res;
    }

    async #findUsername(username: string) {
        const res = await User.findOne({ where: { username: username } });
        return res;
    }
}

export default new UserValidator();
