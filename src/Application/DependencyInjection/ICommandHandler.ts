import { ICommand } from ".";

export interface ICommandHandler<TCommand extends ICommand<TResponse>, TResponse> {
    handle(command: TCommand): Promise<TResponse>;
}
