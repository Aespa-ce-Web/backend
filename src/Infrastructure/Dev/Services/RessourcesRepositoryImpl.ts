import { RessourcesRepository } from "../../../Application/Ressources/Service/RessourcesRepository";
import { ReservationNotFoundException } from "../../../Domain/Exceptions/ReservationNotFoundException";
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

    async getDisponibilitesRessources(startDate: Date, endDate: Date): Promise<Ressource[]> {
        try {
            const result = await pool.query(
                `
                SELECT r.id AS resource_id, r.nom AS resource_nom, r.type AS resource_type, r.group_Id AS resource_groupId, rr.start_date AS reserved_start, rr.end_date AS reserved_end
                FROM resources r
                LEFT JOIN resource_reservations rr
                    ON r.id = rr.resource_id
                    AND (
                        (rr.start_date <= $1 AND rr.end_date >= $1) OR
                        (rr.start_date <= $2 AND rr.end_date >= $2) OR
                        (rr.start_date >= $1 AND rr.end_date <= $2)
                    )
                WHERE rr.reservation_id IS NOT NULL OR rr.reservation_id IS NULL
                ORDER BY r.id, rr.start_date
                `,
                [startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]]
            );
            console.log(result.rows);
            const resources = result.rows.reduce((acc: any[], row: any) => {
            let resource = acc.find(r => r.resource_id === row.resource_id);
            console.log(resource);
            if (!resource) {
                resource = {
                    resource_id: row.resource_id,
                    resource_name: row.resource_nom,
                    resource_type: row.resource_type,
                    resource_groupId: row.resource_groupid,
                    availability_periods: []
                };
                acc.push(resource);
            }

            if (row.reserved_start && row.reserved_end) {
                let reservedStart = new Date(row.reserved_start);
                let reservedEnd = new Date(row.reserved_end);

                let availablePeriods: { start_date: string, end_date: string }[] = [];

                if (reservedStart > startDate) {
                    availablePeriods.push({
                        start_date: startDate.toISOString().split("T")[0],
                        end_date: reservedStart.toISOString().split("T")[0]
                    });
                }

                if (reservedEnd < endDate) {
                    availablePeriods.push({
                        start_date: new Date(reservedEnd.setDate(reservedEnd.getDate() + 2)).toISOString().split("T")[0],
                        end_date: endDate.toISOString().split("T")[0]
                    });
                }
                resource.availability_periods.push(...availablePeriods);
            }
            return acc;
        }, []);
        return resources;
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

    async supprimerReservationParDate(ressourceId: number, startDate: Date, endDate: Date): Promise<void> {
        try {
            const result = await pool.query(
                `
                DELETE FROM resource_reservations
                WHERE resource_id = $1
                  AND start_date = $2
                  AND end_date = $3
                RETURNING *;
                `,
                [ressourceId, startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]]
            );

            if (result.rowCount === 0) {
                console.log(`Aucune réservation trouvée pour la ressource ${ressourceId} entre ${startDate} et ${endDate}`);
                throw new ReservationNotFoundException();
            }

            console.log(`Réservation pour la ressource ${ressourceId} entre ${startDate} et ${endDate} supprimée avec succès`);
        } catch (error) {
            if (error instanceof Error && (error as any).code === '23503') {
                throw error;
            }
            if (error instanceof ReservationNotFoundException) {
                throw error;
            }
            console.error("Erreur lors de la suppression de la réservation de la ressource :", error);
            throw new Error('Erreur lors de la suppression de la réservation de la ressource');
        }
    }


}