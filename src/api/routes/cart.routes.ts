import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';

const cartRoutes = Router();
const controller = new CartController();

cartRoutes.post('/add', controller.addProduct);
cartRoutes.get('/:userId', controller.getCart);
cartRoutes.patch('/:userId/item', controller.updateItem);
cartRoutes.delete('/:cartId/item/:itemId', controller.removeItem);
cartRoutes.delete('/:userId', controller.clearCart);

export default cartRoutes;
