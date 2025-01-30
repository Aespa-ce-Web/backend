export class InventaireException extends Error {
    statusCode: number;
    articleId: number;

    constructor(articleId: number) {
        super(`Impossible d'ajuster la quantité de l'article ${articleId} en dessous de 0`);
        this.name = "INVENTAIRE_EXCEPTION";
        this.statusCode = 400;
        Error.captureStackTrace(this, InventaireException);
        this.articleId = articleId;
    }
}