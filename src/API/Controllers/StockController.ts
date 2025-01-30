import { DomainException } from "../../Domain/Exceptions";
import { ArticleNotFoundException } from "../../Domain/Exceptions/ArticleNotFoundException";
import { InventaireException } from "../../Domain/Exceptions/InventaireException";
import { SortieArticleException } from "../../Domain/Exceptions/SortieArticleException";
import { InventaireRequestDto } from "../../Domain/Inventaire/InventaireRequestDto";
import { NouvelleEntreeRequestDto } from "../../Domain/Stock/NouvelleEntreeRequestDto";
import { NouvelleEntreeResponseDto } from "../../Domain/Stock/NouvelleEntreeResponseDto";
import { NouvelleSortieRequestDto } from "../../Domain/Stock/NouvelleSortieRequestDto";
import { NouvelleSortieResponseDto } from "../../Domain/Stock/NouvelleSortieResponseDto";
import { StockRepository } from "../../Infrastructure/Dev/Services/StockRepository";
import { Request, Response } from "express";


export class StockController {

    _stockRepository: StockRepository;
    
        public constructor(
            stockRepository: StockRepository) {
            this._stockRepository = stockRepository;
        }

    public async getArticles(request: Request, response: Response): Promise<void> {
        
        try {
            const result = await this._stockRepository.getAllArticles();
            response.status(200).send(result);

        } catch (e: unknown) {
            if (e instanceof DomainException) {
                console.error(e.stack);
                response.status(e.httpStatusCode).send(e.message);
            } else {
                console.error(e);
                response.status(500).send(`Internal Server Error: ${e}`);
            }
        }
    }

    public async addEntry(request: Request, response: Response): Promise<void> {
        const { articleId, quantite }: NouvelleEntreeRequestDto = request.body;

        if (!articleId || !quantite || quantite <= 0) {
            response.status(400).json({
                error: "Données invalides",
                message: "Veuillez vérifier l'article et la quantité (doit être supérieur à zéro)."
            });
        }

        try {
            const result = await this._stockRepository.addEntry(articleId, quantite);

            const responseDto: NouvelleEntreeResponseDto = {
                message: "Entrée de stock ajoutée avec succès",
                articleId,
                reference: result.reference,
                nom: result.nom,
                quantiteAjoutee: quantite,
                quantiteTotale: result.quantite_stock
            };

            response.status(201).json(responseDto);
        } catch (error : unknown) {
            if (error instanceof ArticleNotFoundException) {
                response.status(error.statusCode).json({
                    error: error.name,
                    message: error.message
                });
                return;
            }
            response.status(500).send(`Internal Server Error: ${error}`);
        }
    }

    public async addExit(request: Request, response: Response): Promise<void> {
        try {
            const { articleId, quantite }: NouvelleSortieRequestDto = request.body;

            const result = await this._stockRepository.addExit(articleId, quantite);

            const responseDto = new NouvelleSortieResponseDto(
                result.nom,
                result.reference,
                result.quantite_stock
            );
            response.status(200).send(responseDto);

        }catch (error : any) {
            if (error instanceof ArticleNotFoundException) {
                response.status(error.statusCode).json({
                    error: error.name,
                    message: error.message
                });
                return;
            }
            if (error instanceof SortieArticleException) {
                response.status(error.statusCode).json({
                    error: error.name,
                    message: error.message
                });
                return;
            }
            response.status(500).send(`Internal Server Error: ${error}`);
        }
    }

    public async updateInventory(request: Request, response: Response): Promise<void> {
        try {               
            const inventaire: InventaireRequestDto = request.body;
    
            const result = await this._stockRepository.updateStock(inventaire);
    
            response.status(200).send(result);
        } catch (error) {
            if (error instanceof InventaireException) {
                response.status(error.statusCode).json({
                    error: error.name,
                    message: error.message
                });
                return;
            }
            console.error("Erreur lors de la mise à jour de l'inventaire :", error);
            response.status(500).send("Erreur interne du serveur");
        }
    }
}