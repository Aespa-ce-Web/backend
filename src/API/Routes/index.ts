import * as express from "express";
import { ServiceProvider } from "../../Application/DependencyInjection";
import { helloRoutes } from "./hello";

export const registerRoutes = (app: express.Application, services: ServiceProvider): void => {
    app.use("/", helloRoutes(services));
    /**
     * @swagger
     * /:
     *   get:
     *     summary: "Retourne un message de salutation"
     *     description: "Cette route renvoie un message de salutation par défaut."
     *     responses:
     *       200:
     *         description: "Message de salutation par défaut"
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: "Hello World!"
     */
    app.get("/", async (req: express.Request, res: express.Response) => {
        res.status(200).send(await Promise.resolve("Hello World!"));
    });
};
