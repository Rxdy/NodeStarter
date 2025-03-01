import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import db from "../database/db";

interface UserAttributes {
    id: string;
    username: string;
    mail: string;
    password: string;
}

interface userCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
    extends Model<UserAttributes, userCreationAttributes>
    implements UserAttributes
{
    public id!: string;
    public username!: string;
    public mail!: string;
    public password!: string;

public static initialize(sequelize: Sequelize){
User.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: "unique_username",
                msg: "Cet identifiant est déjà utilisé.",
            },
            validate: {
                notNull: {
                    msg: "L'identifiant ne doit pas être nul.",
                },
                notEmpty: {
                    msg: "L'identifiant ne doit pas être vide.",
                },
                len: {
                    args: [1, 15],
                    msg: "Trop de caractères, 15 maximum.",
                },
            },
        },
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: "L'email ne doit pas être nul.",
                },
                notEmpty: {
                    msg: "L'email ne doit pas être vide.",
                },
                isEmail: {
                    msg: "L'email n'est pas en format mail.",
                },
                len: {
                    args: [1, 255],
                    msg: "Trop de caractères, 255 maximum.",
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Le mot de passe ne doit pas être nul.",
                },
                notEmpty: {
                    msg: "Le mot de passe ne doit pas être vide.",
                },
                len: {
                    args: [8, 64],
                    msg: "Le mot de passe doit contenir [8 à 130] caractères.",
                },
            },
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "Users",
    }
);
}
public static setupAssociations() {
    // Pas d'associations pour ce modèle
}
}
export { User, userCreationAttributes };
