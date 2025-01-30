export class Article {
    id: number;
    reference: string;
    nom: string;
    prix_unitaire: number;
    quantite_stock: number;

    constructor(id: number, reference: string, nom: string, prix_unitaire: number, quantite_stock: number) {
        this.id = id;
        this.reference = reference;
        this.nom = nom;
        this.prix_unitaire = prix_unitaire;
        this.quantite_stock = quantite_stock;
    }
}