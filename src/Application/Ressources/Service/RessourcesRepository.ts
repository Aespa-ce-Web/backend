import { Ressource } from "../../../Domain/Ressources/Ressource";
import { DomainService } from "../../DependencyInjection";



export abstract class RessourcesRepository extends DomainService {
    static override readonly serviceName: string = "ressourceRepository";

    public abstract getRessources(): Promise<Ressource[]>;

    public abstract getAvailableRessources(startDate: string, endDate: string): Promise<Ressource[]>;
}
