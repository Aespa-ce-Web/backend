import { Ressource } from './Ressource';

export class RessourceHumaine implements Ressource {
    id: number;
    name: string;
    type: "human" | "machine";
    competences: string[];

    constructor(id: number, name: string, competences: string[]) {
        this.id = id;
        this.name = name;
        this.type = "human";
        this.competences = competences;
    }
}