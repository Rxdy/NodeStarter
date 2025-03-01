import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import config from "config";
import swaggerSpec from "../config/swagger";
import Database from "./database/db";
import { initializeDatabase } from "./database/init";
import { initializeAllModels } from "./models";
import Redis from "./tools/redis";

import auth from "./routes/auth";
import users from "./routes/user";

const port: number = config.get("server.port");
const origin: Array<string> = config.get("cors.origin");
const method: Array<string> = config.get("cors.method");
const allowedHeaders: Array<string> = config.get("cors.allowedHeaders");
const maxAge: number = config.get("cors.maxAge");
const env: string = config.get("server.env");

const app = express();

let corsOptions = {
    origin: origin,
    methods: method,
    allowedHeaders: allowedHeaders,
    maxAge: maxAge,
};

async function initializeApp() {
    try {
        const sequelize = await Database.initialize();
        await initializeAllModels(sequelize);
        await initializeDatabase(env === "Dev" || env === "Test");

        // Test Redis
        Redis.setCache("test-key", { message: "Hello Redis" });
        console.log("   [Redis] ✅ Connexion testée");

        // Middleware
        app.use(cors(corsOptions));
        app.use(bodyParser.json());

        // Routes
        app.use("/auth", auth);
        app.use("/users", users);

        // Route de test
        app.get("/", (req: Request, res: Response) => {
            res.send("Hello Abend !");
        });

        // Fichiers statiques
        app.use("/uploadsFile/module", express.static("src/uploads/module"));
        app.use("/uploadsFile/profil", express.static("src/uploads/profil"));
        app.use("/uploadsFile/email", express.static("src/uploads/email"));

        // Gestion des erreurs
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.error("Erreur serveur :", err);
            res.status(500).json({
                message: "Erreur serveur",
                erreur: err.message || "Une erreur inconnue s'est produite",
            });
        });

        // Swagger uniquement en Dev
        if (env === "Dev") {
            app.use("/api_abnd", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        }

        return app;
    } catch (error) {
        console.error(
            "Erreur lors de l'initialisation de l'application :",
            error
        );
        throw error;
    }
}

export default initializeApp;

if (require.main === module) {
    (async () => {
        await initializeApp();
        app.listen(port, () => {
            console.log("Serveur en ligne.");
            console.log("   [Environnement] ", env);
            console.log("");
            if (env === "Dev") {
                console.log(
                    `Documentation disponible sur http://localhost:${port}/api_abnd`
                );
            }
            console.log("");
        });
    })();
}
