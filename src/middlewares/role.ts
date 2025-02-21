import { Request, Response, NextFunction } from "express";

// Middleware de vérification de rôle
const role = (req: Request, res: Response, next: NextFunction) => {
  const role = req.headers.role;

  if (role !== "true") {
    res.status(401).json({
      message:
        "L'utilisateur n'est pas administrateur, donc il n'est pas autorisé à accéder à cette ressource.",
    });
  } else {
    next();
  }
};

export default role;
