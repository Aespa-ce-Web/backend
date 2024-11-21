import { ServiceProvider } from "../../Application/DependencyInjection";
import { NameRepository } from "../../Application/Hello/Services";
import { DevNameRepository } from "./Services"

function registerDevServices(serviceProvider: ServiceProvider): void {
    serviceProvider
        .addSingleton(NameRepository.serviceName, DevNameRepository);
};

export default registerDevServices;
