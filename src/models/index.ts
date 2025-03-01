import { Sequelize } from "sequelize";

import { User } from "./user";

export const models = [
    User,
];

export async function initializeAllModels(sequelize: Sequelize) {
    // Étape 1 : Initialise tous les modèles
    for (const model of models) {
        model.initialize(sequelize);
    }

    // Étape 2 : Configure les associations
    for (const model of models) {
        model.setupAssociations();
    }
}

export { User };
