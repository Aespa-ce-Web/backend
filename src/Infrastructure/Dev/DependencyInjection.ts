import { ServiceProvider } from "../../Application/DependencyInjection";
import { NameRepository } from "../../Application/Hello/Services";
import { RessourcesRepository } from "../../Application/Ressources/Service/RessourcesRepository";
import { DevNameRepository } from "./Services"
import { RessourcesRepositoryImpl } from "./Services/RessourcesRepositoryImpl";

function registerDevServices(serviceProvider: ServiceProvider): void {
    serviceProvider
        .addSingleton(NameRepository.serviceName, DevNameRepository)
        .addSingleton(RessourcesRepository.serviceName, RessourcesRepositoryImpl);
};

export default registerDevServices;
