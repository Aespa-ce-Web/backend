import { ArticleNotFoundException } from "../../../Domain/Exceptions/ArticleNotFoundException";
import { InventaireException } from "../../../Domain/Exceptions/InventaireException";
import { SortieArticleException } from "../../../Domain/Exceptions/SortieArticleException";
import { InventaireRequestDto, InventaireResponseDto } from "../../../Domain/Inventaire/InventaireRequestDto";
import { Article } from "../../../Domain/Stock/Article";
import pool from "../../../External/db";


export class StockRepository {

    async getAllArticles(): Promise<Article[]> {
    
        try {
            const result = await pool.query('SELECT * FROM articles');

            return result.rows as Article[];
        }
        catch (error) {
            console.error("Erreur lors de la récupération des articles :", error);
            throw new Error('Erreur lors de la récupération des articles');
        }
    }

    async addEntry(articleId: number, quantite: number): Promise<{ nom: string, reference: string, quantite_stock: number }> {
        try {
            const result = await pool.query(
                `
                WITH new_entry AS (
                    INSERT INTO entrees_stock (article_id, quantite, date_entree)
                    VALUES ($1, $2, NOW())
                    RETURNING article_id, quantite
                )
                UPDATE articles
                SET quantite_stock = quantite_stock + (SELECT quantite FROM new_entry)
                WHERE id = (SELECT article_id FROM new_entry)
                RETURNING articles.nom, articles.reference, articles.quantite_stock;
                `,
                [articleId, quantite]
            );
            const row = result.rows[0];

            return {
                nom: row.nom,
                reference: row.reference,
                quantite_stock: row.quantite_stock
            };

        } catch (error) {
            if (error instanceof Error && (error as any).code === '23503') {
                throw new ArticleNotFoundException(articleId);
            }
            console.error("Erreur lors de l'ajout d'une entrée de stock :", error);
            throw new Error("Impossible d'ajouter l'entrée de stock");
        }
    }

    async addExit(articleId: number, quantite: number): Promise<{ nom: string, reference: string, quantite_stock: number }> {
        try {
            // Vérifier si la quantité demandée est disponible en stock
            const checkStock = await pool.query(
                `
                SELECT quantite_stock
                FROM articles
                WHERE id = $1
                `,
                [articleId]
            );
    
            const article = checkStock.rows[0];
            if (!article) {
                throw new ArticleNotFoundException(articleId);
            }

            if (article.quantite_stock < quantite) {
                throw new SortieArticleException(articleId, quantite, article.quantite_stock);
            }
            
            const result = await pool.query(
                `
                WITH new_exit AS (
                    INSERT INTO sorties_stock (article_id, quantite, date_sortie)
                    VALUES ($1, $2, NOW())
                    RETURNING article_id, quantite
                )
                UPDATE articles
                SET quantite_stock = quantite_stock - (SELECT quantite FROM new_exit)
                WHERE id = (SELECT article_id FROM new_exit)
                RETURNING articles.nom, articles.reference, articles.quantite_stock;
                `,
                [articleId, quantite]
            );
            
            const row = result.rows[0];

            return {
                nom: row.nom,
                reference: row.reference,
                quantite_stock: row.quantite_stock
            };
    
        } catch (error) {
            console.error("Erreur lors de la sortie de stock :", error);
            if (error instanceof Error && (error as any).code === '23503') {
                throw new ArticleNotFoundException(articleId);
            }
            if (error instanceof ArticleNotFoundException) {
                throw new ArticleNotFoundException(articleId);
            }
            if (error instanceof SortieArticleException) {
                throw new SortieArticleException(articleId, quantite, error.quantiteDisponible);
            }
            throw new Error("Impossible d'ajouter la sortie de stock.");
        }
    }

    async updateStock(inventaire: InventaireRequestDto): Promise<InventaireResponseDto> {
        try {
            const results: InventaireResponseDto = [];
            for (const item of inventaire) {
                const { articleId, quantiteAjustee } = item;

                if (quantiteAjustee < 0) {
                    throw new InventaireException(articleId);
                }

                const result = await pool.query(
                    `
                    UPDATE articles
                    SET quantite_stock = $1
                    WHERE id = $2
                    RETURNING id, nom, reference, quantite_stock;
                    `,
                    [quantiteAjustee, articleId]
                );
    
                const row = result.rows[0];
                console.log(row);
                
                results.push({
                    articleId: row.id,
                    nom: row.nom,
                    reference: row.reference,
                    quantite_stock: row.quantite_stock,
                });
            }
    
            return results;
        } catch (error) {
            if (error instanceof InventaireException) {
                throw new InventaireException(error.articleId);
            }
            console.error("Erreur lors de la mise à jour du stock :", error);
            throw new Error("Impossible de mettre à jour le stock.");
        }
    }
    
}