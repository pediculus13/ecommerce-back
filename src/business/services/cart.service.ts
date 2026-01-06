import { OrderRepository } from '../../data/repository/order.repository';
import { OrderItemRepository } from '../../data/repository/orderItem.repository';
// import { UserRepository } from '../../data/repository/user.repository';
import {
    AddToCartRequest,
    CartResponse,
    CartItemResponse
} from '../interface/cart.interface';

export class CartService {
    private orderRepository = new OrderRepository();
    private orderItemRepository = new OrderItemRepository();
    // private userRepository = new UserRepository();

    private async getOrCreateCart(userId: number) {

        let cart = await this.orderRepository.findActiveCartByUserId(userId);

        if (!cart) {
            cart = await this.orderRepository.create({
                id_user: userId,
                status: 'active'
            });
        }

        return cart;
    }

    async addProductToCart(request: AddToCartRequest): Promise<CartResponse> {

        const cart = await this.getOrCreateCart(request.id_user);

        const existingItem = await this.orderItemRepository.findByOrderAndProduct(
            cart.id_order,
            request.id_product
        );

        if (existingItem) {
            await this.orderItemRepository.incrementQuantity(
                existingItem.id_item,
                request.quantity
            );
        } else {
            await this.orderItemRepository.create({
                id_order: cart.id_order,
                id_product: request.id_product,
                sku: request.sku,
                title: request.title,
                brand: request.brand,
                price: request.price,
                original_price: request.original_price,
                discount_percentage: request.discount_percentage,
                quantity: request.quantity,
                thumbnail: request.thumbnail
            });
        }

        return await this.getCartByUser(request.id_user);
    }

    async getCartByUser(userId: number): Promise<CartResponse> {
        const cart = await this.orderRepository.findActiveCartByUserId(userId);

        if (!cart) {
            throw new Error(`No active cart found for user ${userId}`);
        }

        const items = await this.orderItemRepository.findByOrderId(cart.id_order);

        const cartItems: CartItemResponse[] = items.map(item => ({
            id_item: item.id_item,
            id_product: item.id_product,
            sku: item.sku,
            title: item.title,
            brand: item.brand,
            price: item.price,
            original_price: item.original_price,
            discount_percentage: item.discount_percentage,
            quantity: item.quantity,
            thumbnail: item.thumbnail,
            subtotal: item.subtotal
        }));

        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

        return {
            id_order: cart.id_order,
            id_user: cart.id_user,
            status: cart.status,
            total_amount: totalAmount,
            items: cartItems,
            item_count: items.length,
            total_quantity: totalQuantity,
            created_at: cart.created_at,
            updated_at: cart.updated_at
        };
    }

    async updateCartItemQuantity(userId: number, itemId: number, quantity: number): Promise<CartResponse> {

        const item = await this.orderItemRepository.findById(itemId);
        if (!item) {
            throw new Error(`Cart item with id ${itemId} not found`);
        }

        const cart = await this.orderRepository.findById(item.id_order);
        if (!cart || cart.id_user !== userId) {
            throw new Error('Cart item does not belong to this user');
        }

        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }

        await this.orderItemRepository.update(itemId, { quantity });

        // Return updated cart
        return await this.getCartByUser(userId);
    }

    async removeItem(cartId: number, itemId: number): Promise<void> {
        // Verify item exists
        const item = await this.orderItemRepository.findById(itemId);
        if (!item) {
            throw new Error(`Cart item with id ${itemId} not found`);
        }

        if (item.id_order !== cartId) {
            throw new Error('Cart item does not belong to this cart');
        }

        await this.orderItemRepository.delete(itemId);
    }


    async removeFromCart(userId: number, itemId: number): Promise<CartResponse> {

        const item = await this.orderItemRepository.findById(itemId);
        if (!item) {
            throw new Error(`Cart item with id ${itemId} not found`);
        }

        const cart = await this.orderRepository.findById(item.id_order);
        if (!cart || cart.id_user !== userId) {
            throw new Error('Cart item does not belong to this user');
        }

        await this.orderItemRepository.delete(itemId);

        return await this.getCartByUser(userId);
    }

    async clearCart(userId: number): Promise<void> {
        const cart = await this.orderRepository.findActiveCartByUserId(userId);

        if (cart) {
            await this.orderItemRepository.deleteByOrderId(cart.id_order);
        }
    }
}