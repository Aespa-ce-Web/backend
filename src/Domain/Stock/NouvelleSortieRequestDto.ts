export class NouvelleSortieRequestDto {
    articleId: number;
    quantite: number;

    constructor(articleId: number, quantite: number) {
        this.articleId = articleId;
        this.quantite = quantite;
    }
}
