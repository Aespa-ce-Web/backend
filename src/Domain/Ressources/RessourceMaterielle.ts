import { Ressource } from './Ressource';

export class RessourceMaterielle implements Ressource{
    id: number;
    name: string;
    type: "human" | "machine";
    description: string;
    competences: string[];
    constructor(id: number, name: string, description: string, competences: string[]){
        this.id = id;
        this.name = name;
        this.type = "machine";
        this.description = description;
        this.competences = competences;
    }
}