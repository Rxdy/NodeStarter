import { Sequelize } from "sequelize";
import config from "config";
import logger from "../tools/logger";

type Dialect = 'mysql' | 'postgres' | 'mariadb' | 'sqlite' | 'mssql';
interface DBConfig {
    name: string;
    user: string;
    password: string;
    host: string;
    port: number;
    dialect: Dialect;
}
class Database {

    public abend: Sequelize;
    // public abyss: Sequelize;

    private constructor() {

        const abendConfig = config.get<DBConfig>("db");
        this.abend = new Sequelize(abendConfig.name, abendConfig.user, abendConfig.password, {
            host: abendConfig.host,
            port: abendConfig.port,
            dialect: abendConfig.dialect,
            logging: (msg) => {
                msg = msg.split(":")[1].trim();
                logger.info(msg);
            },
        });

        this.testConnection(this.abend, "abend");
    }

    private async testConnection(sequelize: Sequelize, dbName: string) {
        try {
            await sequelize.authenticate();
            console.log(`   [MySQL] ✅ Connecté à ${dbName}`);
        } catch (error) {
            console.error(`   [MySQL] ❌ Erreur de connexion à ${dbName}:`, error);
        }
    }

    public static getInstance(): Database {

        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    private static instance: Database;
}

export default Database.getInstance();
