export class RessourceNotFoundException extends Error {
    statusCode: number;
    resourceId: number;

    constructor(resourceId: number) {
        super(`La ressource avec l'ID ${resourceId} n'existe pas`);
        this.name = "RESSOURCE_NOT_FOUND";
        this.statusCode = 404;
        Error.captureStackTrace(this, RessourceNotFoundException);
        this.resourceId = resourceId;
    }
}