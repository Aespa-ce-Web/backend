export class Hello {
    public readonly greeting: string;
    public readonly name: string;

    public constructor(greeting: string, name: string) {
        this.greeting = greeting;
        this.name = name;
    }

    public toString(): string {
        return `${this.greeting} ${this.name}!`;
    }
}
