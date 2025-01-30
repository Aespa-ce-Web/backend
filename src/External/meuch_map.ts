interface MeuchEndpointInput {
    key: string;
    endpoint: string;
    description: string;
    type: "GET" | "POST" | "PUT" | "DELETE";  // Type de la méthode HTTP
    routeFormat?: string;  // Format de la route (optionnel)
    queryParams?: string[];  // Paramètres de requête (optionnels)
    body?: string;  // Corps de la requête (optionnel)
}

export const endpoints: MeuchEndpointInput[] = [
    {
        key: "STO_GET_RESSOURCES",
        endpoint: "/ressources",
        description: "Récupération de toutes les ressources",
        type: "GET",
    },
    {
        key: "STO_GET_RESSOURCES_AVAILABLE",
        endpoint: "/ressources/available",
        description: "Récupération des ressources disponibles entre deux dates",
        type: "GET",
        queryParams: ["start_date", "end_date"]
    },
    {
        key: "STO_RESERVER_RESSOURCE",
        endpoint: "/ressources/reserver",
        description: "Réserver une ressource pendant une période donnée",
        type: "POST",
        body : "{ressource_id:number ,start_date:Date ,end_date:Date}"
    },
    {
        key: "STO_SUPPRIMER_RESERVATION",
        endpoint: "/ressources/reservation",
        description: "Supprimer une réservation de ressource",
        type: "DELETE",
        body : "{ressource_id:number ,start_date:Date ,end_date:Date}"
    }
];