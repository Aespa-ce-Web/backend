import { NameRepository } from "../../../Application/Hello/Services";

export class DevNameRepository implements NameRepository {
    public getName(): Promise<string> {
        return new Promise((resolve) => resolve("World"));
    }
}
