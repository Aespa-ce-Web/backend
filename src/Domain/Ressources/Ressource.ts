export interface Ressource {
    id: number;
    name: string;
    type: "human" | "machine";
    competences: string[];
}