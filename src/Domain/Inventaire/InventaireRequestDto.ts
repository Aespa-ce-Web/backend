interface InventaireRequest {
    articleId: number;
    quantiteAjustee: number;
}

export type InventaireRequestDto = InventaireRequest[];


interface InventaireAjusteResponseDto {
    articleId: number;     
    nom: string;               
    reference: string;         
    quantite_stock: number;   
}

export type InventaireResponseDto = InventaireAjusteResponseDto[];
