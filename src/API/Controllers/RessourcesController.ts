import { Request, Response } from "express"
import { DomainException } from "../../Domain/Exceptions";
import { RessourcesRepository } from "../../Application/Ressources/Service/RessourcesRepository";
import { RessourceNotFoundException } from "../../Domain/Exceptions/RessourceNotFoundException";
import { SupprimerReservationRequestDto } from "../../Domain/Reservation/SupprimerReservationRequestDto";
import { ReservationNotFoundException } from "../../Domain/Exceptions/ReservationNotFoundException";

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
        
        const { start_date, end_date } = request.query;

        const validation = this.validateDates(start_date as string, end_date as string);

        if (validation.error) {
            response.status(400).json({
                error: "Bad Request",
                message: validation.message
            });
            return;
        }

        try {
            const result = await this._ressourcesRepository.getDisponibilitesRessources(validation.startDate!, validation.endDate!);
            response.status(200).send(result);

        } catch (e: unknown) {
            if (e instanceof DomainException) {
                console.error(e.stack);
                response.status(e.httpStatusCode).send(e.message);
            } else {
                console.error(e);
                response.status(500).send(`Internal Server Error: ${e}`);
            }
        }
    }

    public async reserverRessource(request: Request, response: Response): Promise<void> {
        const { ressource_id, start_date, end_date, isAbsence } = request.body;

        const validation = this.validateDates(start_date as string, end_date as string);

        if (validation.error) {
            response.status(400).json({
                error: "Bad Request",
                message: validation.message
            });
            return;
        }else if (!ressource_id || isNaN(ressource_id)) {
            response.status(400).json({
                error: "Bad Request",
                message: "Veuillez fournir un ressource_id sous forme de nombre"
            });
            return;
        }

        try {
            await this._ressourcesRepository.reserverRessource(ressource_id, validation.startDate!, validation.endDate!, isAbsence);
            response.status(201).json({ message: "Ressource réservée" });

        } catch (e: unknown) {
            if (e instanceof RessourceNotFoundException) {
                response.status(e.statusCode).json({
                    error: e.name,
                    message: e.message
                });
                return;
            }
            else if (e instanceof DomainException) {
                console.error(e.stack);
                response.status(e.httpStatusCode).send(e.message);
            } else {
                console.error(e);
                response.status(500).send(`Internal Server Error: ${e}`);
            }
        }
    }

    private validateDates(startDateString: string | undefined, endDateString: string | undefined): { error: boolean, message?: string, startDate?: Date, endDate?: Date } {
        if (!startDateString || !endDateString) {
            return { error: true, message: "Veuillez fournir une start_date et une end_date." };
        }

        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return { error: true, message: "Les dates doivent être au format AAAA-MM-JJ" };
        }

        if (startDate > endDate) {
            return { error: true, message: "La date de début ne peut pas être après la date de fin." };
        }
        return { error: false, startDate, endDate };
    }

    public async supprimerReservationParDate(request: Request, response: Response): Promise<void> {
        const requestDto: SupprimerReservationRequestDto = request.body;

        try {
            this.validateDates(requestDto.start_date, requestDto.end_date);
            
            await this._ressourcesRepository.supprimerReservationParDate(
                requestDto.ressource_id,  
                new Date(requestDto.start_date),  
                new Date(requestDto.end_date)     
            );
            response.status(200).json({ message: "Créneau supprimé" });        
        } catch (e: unknown) {
            if (e instanceof RessourceNotFoundException) {
                response.status(e.statusCode).json({
                    error: e.name,
                    message: e.message
                });
                return;
            }
            if (e instanceof ReservationNotFoundException) {
                response.status(e.statusCode).json({
                    error: e.name,
                    message: e.message
                });
                return;
            }
            else if (e instanceof DomainException) {
                console.error(e.stack);
                response.status(e.httpStatusCode).send(e.message);
            } else {
                console.error(e);
                response.status(500).send(`Internal Server Error: ${e}`);
            }
        }
    }

    public async getReservationParResource(request: Request, response: Response): Promise<void> {
        const ressource_id = request.query.ressource_id as string;

        if (!ressource_id || isNaN(ressource_id as any)) {
            response.status(400).send({
                error: "Bad Request",
                message: "Veuillez fournir un ressource_id sous forme de nombre"
            });
            return;
        }

        try {
            const result = await this._ressourcesRepository.getReservationParRessources(
                parseInt(ressource_id),  
            );
            
            response.status(200).send(result);

        } catch (e: unknown) {
            if (e instanceof RessourceNotFoundException) {
                response.status(e.statusCode).json({
                    error: e.name,
                    message: e.message
                });
                return;
            }
            else if (e instanceof DomainException) {
                console.error(e.stack);
                response.status(e.httpStatusCode).send(e.message);
            } else {
                console.error(e);
                response.status(500).send(`Internal Server Error: ${e}`);
            }
        }   
    }
}