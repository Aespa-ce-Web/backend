import { Request, Response } from "express"
import { ServiceProvider } from "../../Application/DependencyInjection/ServiceProvider";
import { HelloCommand, HelloCommandHandler } from "../../Application/Hello/Commands";
import { NameRepository } from "../../Application/Hello/Services";
import { DomainException } from "../../Domain/Exceptions";

export class HelloController {
    private readonly _serviceProvider: ServiceProvider;

    public constructor(serviceProvider: ServiceProvider) {
        this._serviceProvider = serviceProvider
    }

    public async hello(request: Request, response: Response): Promise<void> {
        const greeting = request.query.greeting?.toString();
        if (greeting === undefined) {
            response.status(400).send("please provide an greeting");
            return;
        }

        try {
            const command = new HelloCommand(greeting);
            const handler = new HelloCommandHandler(
                this._serviceProvider.get(NameRepository.serviceName)
            );

            const result = await handler.handle(command);
            response.status(200).send(result);

        } catch (e: unknown) {
            if (e instanceof DomainException) {
                console.error(e.stack);
                response.status(e.httpStatusCode).send(e.message);
            } else if (e instanceof Error) {
                console.error(e.stack);
                response.status(500).send(`Internal Server Error: ${e.message}`);
            } else {
                console.error(e);
                response.status(500).send(`Internal Server Error: ${e}`);
            }
        }
    }
}
