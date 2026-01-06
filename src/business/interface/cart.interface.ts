export interface AddToCartRequest {
    id_user: number;
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

export interface UpdateCartItemRequest {
    id_item: number;
    quantity: number;
}

export interface RemoveFromCartRequest {
    id_item: number;
}

export interface CartResponse {
    id_order: number;
    id_user: number;
    status: string;
    total_amount: number;
    items: CartItemResponse[];
    item_count: number;
    total_quantity: number;
    created_at: Date;
    updated_at: Date;
}

export interface CartItemResponse {
    id_item: number;
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
}