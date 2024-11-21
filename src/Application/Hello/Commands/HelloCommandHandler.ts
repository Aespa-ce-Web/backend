import { ICommandHandler } from "../../DependencyInjection";
import { NameRepository } from "../Services";
import { HelloCommand } from "./HelloCommand";
import { Hello } from "../../../Domain/Hello"

export class HelloCommandHandler implements ICommandHandler<HelloCommand, string> {
    _nameService: NameRepository;

    public constructor(
        nameService: NameRepository) {
        this._nameService = nameService;
    }

    public async handle(command: HelloCommand): Promise<string> {

        const name = await this._nameService.getName();
        const hello = new Hello(command.greeting, name);

        return hello.toString();
    }
}
