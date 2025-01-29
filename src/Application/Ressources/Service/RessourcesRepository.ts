import { Ressource } from "../../../Domain/Ressources/Ressource";
import { DomainService } from "../../DependencyInjection";



export abstract class RessourcesRepository extends DomainService {
    static override readonly serviceName: string = "ressourceRepository";

    public abstract getRessources(): Promise<Ressource[]>;

    public abstract getAvailableRessources(startDate: Date, endDate: Date): Promise<Ressource[]>;

    public abstract reserverRessource(ressourceId: number, startDate: Date, endDate: Date): Promise<void>;
}
