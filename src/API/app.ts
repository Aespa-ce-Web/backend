import { HelloController } from "./Controllers";
import { ServiceProvider } from "../Application/DependencyInjection";

import * as express from "express";
import registerDevServices from "../Infrastructure/Dev/DependencyInjection";
import { RessourcesController } from "./Controllers/RessourcesController";
import { RessourcesRepositoryImpl } from "../Infrastructure/Dev/Services/RessourcesRepositoryImpl";

export const services = new ServiceProvider();

registerDevServices(services);

const ressourceService = new RessourcesRepositoryImpl();
export const reportController = new HelloController(services);
export const ressourcesController = new RessourcesController(ressourceService);


const app = express();
const port = 30000;

app.get("/ressources", async (req: express.Request, res: express.Response) =>  await ressourcesController.getAllRessources(req, res));

app.get("/ressources/available", async (req: express.Request, res: express.Response) => await ressourcesController.getAvailableRessources(req, res));

app.get("/hello", async (req: express.Request, res: express.Response) => await reportController.hello(req, res));

app.get("/", async (req: express.Request, res: express.Response) => { res.status(200).send(await new Promise((resolve) => resolve("Hello World!"))) })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
