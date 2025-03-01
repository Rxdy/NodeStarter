import { Sequelize } from "sequelize";
import config from "config";
import logger from "../tools/logger";

type Dialect = "mysql" | "postgres" | "mariadb" | "sqlite" | "mssql";
interface DBConfig {
    name: string;
    user: string;
    password: string;
    host: string;
    port: number;
    dialect: Dialect;
}

class Database {
    public abend: Sequelize | undefined; // Peut être undefined jusqu'à l'initialisation
    private static instance: Database;

    private constructor() {
        // Ne crée pas la connexion ici, juste une initialisation vide
    }

    public async initialize() {
        if (!this.abend) {
            const abendConfig = config.get<DBConfig>("db");
            this.abend = new Sequelize(
                abendConfig.name,
                abendConfig.user,
                abendConfig.password,
                {
                    host: abendConfig.host,
                    port: abendConfig.port,
                    dialect: abendConfig.dialect,
                    dialectOptions: {
                        charset: "utf8mb4", // Ajout pour éviter les problèmes d'encodage
                    },
                    logging: (msg) => {
                        msg = msg.split(":")[1]?.trim() || msg;
                        logger.info(msg);
                    },
                }
            );
            await this.testConnection(this.abend, abendConfig.name);
        }
        return this.abend;
    }

    private async testConnection(sequelize: Sequelize, dbName: string) {
        try {
            await sequelize.authenticate();
            console.log(`   [MySQL] ✅ Connecté à ${dbName}`);
        } catch (error) {
            console.error(
                `   [MySQL] ❌ Erreur de connexion à ${dbName}:`,
                error
            );
            throw error; // Relance l'erreur pour que les tests échouent proprement si besoin
        }
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async close() {
        if (this.abend) {
            await this.abend.close();
            this.abend = undefined;
            console.log("   [MySQL] Connexion fermée");
        }
    }
}

export default Database.getInstance();
