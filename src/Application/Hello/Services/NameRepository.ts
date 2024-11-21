import { DomainService } from "../../DependencyInjection";

export abstract class NameRepository extends DomainService {
    static override readonly serviceName: string = "nameRepository";

    public abstract getName(): Promise<string>;
}
