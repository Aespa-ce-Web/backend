interface MeuchEndpointInput {
    key: string;
    endpoint: string;
    description: string;
    type: "GET" | "POST" | "PUT" | "DELETE";  // Type de la méthode HTTP
    routeFormat?: string;  // Format de la route (optionnel)
    queryParams?: string[];  // Paramètres de requête optionnels
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
        queryParams: ["startDate", "endDate"]
    }
];