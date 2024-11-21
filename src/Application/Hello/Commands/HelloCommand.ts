import { DomainException } from "../../../Domain/Exceptions";
import { ICommand } from "../../DependencyInjection";

export class HelloCommand implements ICommand<string> {
    public readonly greeting: string;

    public constructor(greeting: string) {
        if (greeting === "")
            throw new DomainException("greeting should not be empty", 400);

        this.greeting = greeting;
    }
}