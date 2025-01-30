export class ArticleNotFoundException extends Error {
    statusCode: number;
    articleId: number;

    constructor(articleId: number) {
        super(`L'article avec l'ID ${articleId} n'existe pas`);
        this.name = "ARTICLE_NOT_FOUND";
        this.statusCode = 404;
        Error.captureStackTrace(this, ArticleNotFoundException);
        this.articleId = articleId;
    }
}