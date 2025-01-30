export class ReservationNotFoundException extends Error {
    statusCode: number;

    constructor() {
        super(`Aucune reservation trouvée`);
        this.name = "RESERVATION_NOT_FOUND";
        this.statusCode = 404;
        Error.captureStackTrace(this, ReservationNotFoundException);
    }
}