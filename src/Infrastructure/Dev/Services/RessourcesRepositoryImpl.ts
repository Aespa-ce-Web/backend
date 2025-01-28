import { RessourcesRepository } from "../../../Application/Ressources/Service/RessourcesRepository";
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

    async getAvailableRessources(startDate: string, endDate: string): Promise<Ressource[]> {
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
                [startDate, endDate]
            );
            return result.rows as Ressource[];

        } catch (error) {
            console.error("Erreur lors de la récupération des ressources disponibles :", error);
            throw new Error('Erreur lors de la récupération des ressources disponibles');
        }
    }
}