import { Request, Response } from "express"
import { DomainException } from "../../Domain/Exceptions";
import { RessourcesRepository } from "../../Application/Ressources/Service/RessourcesRepository";


export class RessourcesController {

    _ressourcesRepository: RessourcesRepository;

    public constructor(
        ressourceRepository: RessourcesRepository) {
        this._ressourcesRepository = ressourceRepository;
    }

    public async getAllRessources(request: Request, response: Response): Promise<void> {
        
        try {
            const result = await this._ressourcesRepository.getRessources();
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

    public async getAvailableRessources(request: Request, response: Response): Promise<void> {

        const startDate = String(request.query.start_date);
        const endDate = String(request.query.end_date);

        if (startDate === undefined || endDate === undefined) {
            response.status(400).send("please provide a start and end date");
            return;
        }

        try {
            const result = await this._ressourcesRepository.getAvailableRessources(startDate, endDate);
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