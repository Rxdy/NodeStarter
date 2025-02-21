import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";
import UUID from "./uuid";
import path from "path";
import fs from "fs/promises";

class Image {
    public static instance: Image;
    private uploadModule: multer.Multer;
    private uploadProfil: multer.Multer;

    public constructor() {
        this.uploadModule = multer({
            storage: this.createStorage("../uploads/module"),
        });
        this.uploadProfil = multer({
            storage: this.createStorage("../uploads/profil"),
        });
    }

    private createStorage(uploadPath: string): multer.StorageEngine {
        return multer.diskStorage({
            destination: (req, file, cb) => {
                const destinationPath = path.resolve(__dirname, uploadPath);
                cb(null, destinationPath);
            },
            filename: async (req, file, cb) => {
                try {
                    const filename: string = UUID.v7();
                    cb(null, filename);
                } catch (error) {
                    cb(error as Error, "");
                }
            },
        });
    }

    public async resizeImage(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.file) {
                return next(new Error("Aucun fichier téléchargé."));
            }

            const filePath = req.file.path;
            const tempFilePath = path.join(
                req.file.destination,
                "temp_" + req.file.filename
            );
            const resizedPath = path.join(
                req.file.destination,
                req.file.filename + ".png"
            );

            const metadata = await sharp(filePath).metadata();
            const width = metadata.width!;
            const height = metadata.height!;
            const size = Math.min(width, height);
            const left = (width - size) / 2;
            const top = (height - size) / 2;

            await sharp(filePath)
                .extract({
                    left: Math.floor(left),
                    top: Math.floor(top),
                    width: size,
                    height: size,
                })
                .toFile(tempFilePath);

            await sharp(tempFilePath).resize(256, 256).toFile(resizedPath);

            await fs.unlink(filePath);
            await fs.unlink(tempFilePath);

            req.file.path = resizedPath;
            req.file.filename = req.file.filename + ".png";

            next();
        } catch (error) {
            next(error);
        }
    }

    public getUploadModule(): multer.Multer {
        return this.uploadModule;
    }

    public getUploadProfil(): multer.Multer {
        return this.uploadProfil;
    }
}

export default new Image();
