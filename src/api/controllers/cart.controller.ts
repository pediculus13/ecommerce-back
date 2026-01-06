import { Request, Response, NextFunction } from 'express';
import { CartService } from '../../business/services/cart.service';
import { AddToCartRequest, UpdateCartItemRequest } from '../../business/interface/cart.interface';

export class CartController {
    private service = new CartService();

    addProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as AddToCartRequest;
            const result = await this.service.addProductToCart(body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    getCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.params.userId);
            const cart = await this.service.getCartByUser(userId);
            res.json(cart);
        } catch (error) {
            next(error);
        }
    };

    updateItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.params.userId);
            const body = req.body as UpdateCartItemRequest;
            const result = await this.service.updateCartItemQuantity(userId, body.id_item, body.quantity);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    removeItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { cartId, itemId } = req.params;
            await this.service.removeItem(Number(cartId), Number(itemId));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    clearCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.params.userId);
            await this.service.clearCart(userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
