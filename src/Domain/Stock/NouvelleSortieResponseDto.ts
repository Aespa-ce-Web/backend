export class NouvelleSortieResponseDto {
    nom: string;
    reference: string;
    quantite_stock: number;

    constructor(nom: string, reference: string, quantite_stock: number) {
        this.nom = nom;
        this.reference = reference;
        this.quantite_stock = quantite_stock;
    }
}