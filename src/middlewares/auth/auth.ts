import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import key from "./key";

interface AuthRequest extends Request {
    user?: { id: string };
}

const auth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        res.status(401).json({
            message: "Vous n'avez pas fourni de jeton d'authentification.",
        });
        return;
    }

    const token: string = authorizationHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, key) as JwtPayload;
        req.user = { id: decodedToken.userId };

        next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(401).json({
                message:
                    "L'utilisateur n'est pas autorisé à accéder à cette ressource.",
                date: error.message,
            });
            return;
        }
    }
};

export default auth;
