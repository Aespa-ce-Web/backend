import { Reservation } from "../../../Domain/Reservation/Reservation";
import { Ressource } from "../../../Domain/Ressources/Ressource";
import { DomainService } from "../../DependencyInjection";



export abstract class RessourcesRepository extends DomainService {
    static override readonly serviceName: string = "ressourceRepository";

    public abstract getRessources(): Promise<Ressource[]>;

    public abstract getDisponibilitesRessources(startDate: Date, endDate: Date): Promise<Ressource[]>;

    public abstract reserverRessource(ressourceId: number, startDate: Date, endDate: Date): Promise<void>;

    public abstract supprimerReservationParDate(ressourceId: number, startDate: Date, endDate: Date): Promise<void>;

    public abstract getReservationParRessources(ressourceId: number, startDate: Date, endDate: Date): Promise<Reservation[]>;
}
