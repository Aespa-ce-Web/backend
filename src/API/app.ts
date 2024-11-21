import { HelloController } from "./Controllers";
import { ServiceProvider } from "../Application/DependencyInjection";

import * as express from "express";
import registerDevServices from "../Infrastructure/Dev/DependencyInjection";

export const services = new ServiceProvider();
registerDevServices(services);

export const reportController = new HelloController(services);

const app = express();
const port = 30000;

app.get("/hello", async (req: express.Request, res: express.Response) => await reportController.hello(req, res));
app.get("/", async (req: express.Request, res: express.Response) => { res.status(200).send(await new Promise((resolve) => resolve("Hello World!"))) })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
