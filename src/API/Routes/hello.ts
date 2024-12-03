import * as express from "express";
import { HelloController } from "../Controllers";
import { ServiceProvider } from "../../Application/DependencyInjection";

export const helloRoutes = (services: ServiceProvider): express.Router => {
    const router = express.Router();
    const helloController = new HelloController(services);

    /**
     * @swagger
     * /hello:
     *   get:
     *     summary: "Retourne un message de salutation"
     *     description: "Cette route renvoie un message de salutation comme réponse."
     *     responses:
     *       200:
     *         description: "Message de salutation"
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: "Hello, World!"
     */
    router.get("/hello", async (req: express.Request, res: express.Response) => {
        await helloController.hello(req, res);
    });

    return router;
}
