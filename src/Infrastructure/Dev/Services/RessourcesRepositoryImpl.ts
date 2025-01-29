import { RessourcesRepository } from "../../../Application/Ressources/Service/RessourcesRepository";
import { RessourceNotFoundException } from "../../../Domain/Exceptions/RessourceNotFoundException";
import { Ressource } from "../../../Domain/Ressources/Ressource";
import pool from "../../../External/db";

export class RessourcesRepositoryImpl implements RessourcesRepository {

    async getRessources(): Promise<Ressource[]> {
        try {
            const result = await pool.query('SELECT * FROM resources');

            return result.rows as Ressource[];
        } catch (error) {
            console.error("Erreur lors de la récupération des ressources :", error);
            throw new Error('Erreur lors de la récupération des ressources');
        }
    }

    async getAvailableRessources(startDate: Date, endDate: Date): Promise<Ressource[]> {
        try {
            const result = await pool.query(
                `
                SELECT r.*
                FROM resources r
                LEFT JOIN resource_reservations rr
                    ON r.id = rr.resource_id
                    AND (
                        (rr.start_date <= $1 AND rr.end_date >= $1) OR
                        (rr.start_date <= $2 AND rr.end_date >= $2) OR
                        (rr.start_date >= $1 AND rr.end_date <= $2)
                    )
                WHERE rr.reservation_id IS NULL
                `,
                [startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]]
            );
            return result.rows as Ressource[];

        } catch (error) {
            console.error("Erreur lors de la récupération des ressources disponibles :", error);
            throw new Error('Erreur lors de la récupération des ressources disponibles');
        }
    }

    async reserverRessource(ressourceId: number, startDate: Date, endDate: Date): Promise<void> {
        try {
            await pool.query(
                `
                INSERT INTO resource_reservations (resource_id, start_date, end_date)
                VALUES ($1, $2, $3)
                `,
                [ressourceId, startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]]
            );
        } catch (error) {
            if (error instanceof Error && (error as any).code === '23503') {
                throw new RessourceNotFoundException(ressourceId);
            }
            console.error("Erreur lors de la réservation de la ressource :", error);
            throw new Error('Erreur lors de la réservation de la ressource');
        }
    }
}