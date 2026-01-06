export interface OrderItem {
    id_item: number;
    id_order: number;
    id_product: number;
    sku?: string;
    title: string;
    brand?: string;
    price: number;
    original_price?: number;
    discount_percentage?: number;
    quantity: number;
    thumbnail?: string;
    subtotal: number;
    created_at: Date;
    updated_at: Date;
}

export interface CreateOrderItemDTO {
    id_order: number;
    id_product: number;
    sku?: string;
    title: string;
    brand?: string;
    price: number;
    original_price?: number;
    discount_percentage?: number;
    quantity: number;
    thumbnail?: string;
}

export interface UpdateOrderItemDTO {
    quantity: number;
}
