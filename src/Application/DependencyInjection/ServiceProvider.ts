import { DomainService } from "./DomainService";

type Constructor<TService extends DomainService> = new () => TService;

export class ServiceProvider {
    private readonly singletonRegistry = new Map<string, DomainService>();
    private readonly transientRegistry = new Map<string, Constructor<DomainService>>();

    public get<TService extends DomainService>(serviceName: string): TService {
        if (this.singletonRegistry.has(serviceName)) {
            return this.singletonRegistry.get(serviceName) as TService;
        }

        if (this.transientRegistry.has(serviceName)) {
            const infrastructureService = this.transientRegistry.get(serviceName) as Constructor<TService>;
            return new infrastructureService();
        }

        throw new Error(`No rule found for the requested service: ${serviceName}`);
    }

    public addSingleton<TService extends DomainService>(serviceName: string, infrastructureService: Constructor<TService>): ServiceProvider {
        const instance = new infrastructureService();
        this.singletonRegistry.set(serviceName, instance);
        return this;
    }

    public addTransient<TService extends DomainService>(serviceName: string, infrastructureService: Constructor<TService>): ServiceProvider {
        this.transientRegistry.set(serviceName, infrastructureService);
        return this;
    }
}
