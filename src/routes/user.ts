//Express
import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
//Controller
import UserController from "../controllers/user";
//Tools
import Image from "../tools/multer";

//Middleware
import auth from "../middlewares/auth/auth";
import role from "../middlewares/role";
//Controller
import UserValidator from "../validators/user";

interface AuthRequest extends Request {
    user?: { id: string }; // Ajout d'un champ user dans req
}

// Création d'un nouvel utilisateur
router.post("/", auth, role, async (req: Request, res: Response) => {
    const error = await UserValidator.data(req.body);
    if (error) {
        res.status(400).json({ Erreur: error });
        return;
    }
    try {
        await UserController.add(req.body);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", erreur: error });
    }
});

// Selection de tout les utilisateurs
router.get("/", auth, role, async (req: Request, res: Response) => {
    try {
        const user = await UserController.getAll();
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", erreur: error });
    }
});

export default router;
