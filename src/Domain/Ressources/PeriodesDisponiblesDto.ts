export interface DisponibilitesRessources {
    resource_id: number;
    resource_name: string;
    resource_type: "human" | "machine";
    resource_groupId: number;
    availability_periods: {
        start_date: string;
        end_date: string;
    }[];
}