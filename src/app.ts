import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
import config from "config";

import Redis from "./tools/redis";

const port: number = config.get("server.port");
const origin: Array<string> = config.get("cors.origin");
const method: Array<string> = config.get("cors.method");
const allowedHeaders: Array<string> = config.get("cors.allowedHeaders");
const maxAge: number = config.get("cors.maxAge");
const env: string = config.get("server.env");

//Initialisation de la bdd
require("./database/init");

// Test de la connexion en sauvegardant une donnée.
function testRedis() {
    Redis.setCache("test-key", { message: "Hello Redis" });
}
testRedis();

let corsOptions = {
    origin: origin,
    methods: method,
    allowedHeaders: allowedHeaders,
    maxAge: maxAge,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

import auth from "./routes/auth";
app.use("/auth", auth);

import users from "./routes/user";
app.use("/users", users);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello Node API !");
});

if (env == "Dev") {
    const swaggerDocument = YAML.load("./docs/swagger.yaml");
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/uploadsFile/profil", express.static("src/uploads/profil"));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Erreur serveur :", err);

    res.status(500).json({
        message: "Erreur serveur",
        erreur: err.message || "Une erreur inconnue s'est produite",
    });
});

app.listen(port, () => {
    console.log("Serveur en ligne.");
    console.log("   [Environnement] ", env);
});
