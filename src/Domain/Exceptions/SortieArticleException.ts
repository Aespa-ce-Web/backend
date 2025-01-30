export class SortieArticleException extends Error {
    articleId: number;
    quantiteDemande: number;
    quantiteDisponible: number;
    statusCode: number;

    constructor(articleId: number, quantiteDemande: number, quantiteDisponible: number) {
        super(`Impossible de sortir ${quantiteDemande} unités de l'article ${articleId}. Quantité disponible : ${quantiteDisponible}`);
        this.statusCode = 400;
        this.name = "SORTIE_ARTICLE_EXCEPTION";
        this.quantiteDemande = quantiteDemande;
        this.quantiteDisponible = quantiteDisponible;
        Error.captureStackTrace(this, SortieArticleException);
        this.articleId = articleId;


    }
}
