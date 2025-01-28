import { HelloController } from "./Controllers";
import { ServiceProvider } from "../Application/DependencyInjection";

import * as express from "express";
import registerDevServices from "../Infrastructure/Dev/DependencyInjection";
import { RessourcesController } from "./Controllers/RessourcesController";
import { RessourcesRepositoryImpl } from "../Infrastructure/Dev/Services/RessourcesRepositoryImpl";
import axios from "axios";
import * as dotenv from "dotenv";
import { endpoints } from "../External/meuch_map";


export const services = new ServiceProvider();

registerDevServices(services);

const ressourceService = new RessourcesRepositoryImpl();
export const reportController = new HelloController(services);
export const ressourcesController = new RessourcesController(ressourceService);


const app = express();
const port = 30000;

dotenv.config();
const registerApp = async () => {
  try {
    const response = await axios.post(process.env.MIDDLEWARE_REGISTER_URL as string, {
      appKey: process.env.APP_KEY,
      url: process.env.STORE_BACKEND_URL
    });
    console.log("App registered successfully:", response.data);
  } catch (error) {
    console.error("Error registering app:", error);
  }
};
registerApp();

app.get("/meuch_map", (req, res) => {
  res.status(200).json(endpoints);
});

app.get("/ressources", async (req: express.Request, res: express.Response) =>  await ressourcesController.getAllRessources(req, res));

app.get("/ressources/available", async (req: express.Request, res: express.Response) => await ressourcesController.getAvailableRessources(req, res));

app.get("/hello", async (req: express.Request, res: express.Response) => await reportController.hello(req, res));

app.get("/", async (req: express.Request, res: express.Response) => { res.status(200).send(await new Promise((resolve) => resolve("Hello World!")))});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  

})
