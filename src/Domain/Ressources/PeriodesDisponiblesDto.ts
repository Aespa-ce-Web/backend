export interface DisponibilitesRessources {
    resource_id: number;
    resource_name: string;
    availability_periods: {
        start_date: string;
        end_date: string;
    }[];
}