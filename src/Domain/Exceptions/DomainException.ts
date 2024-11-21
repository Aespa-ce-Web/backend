export class DomainException extends Error {
    public readonly httpStatusCode: number;

    public constructor(message: string, statusCode: number) {
        super(message);
        this.httpStatusCode = statusCode;
    }
}
