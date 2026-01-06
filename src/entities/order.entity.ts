export interface Order {
    id_order: number;
    id_user: number;
    status: string;
    total_amount: number;
    created_at: Date;
    updated_at: Date;
}

export interface CreateOrderDTO {
    id_user: number;
    status?: string;
}
