import Database from '../database/connection';
import { OrderItem, CreateOrderItemDTO, UpdateOrderItemDTO } from '../../entities/orderItem.entity';

export class OrderItemRepository {
    private db = Database.getInstance();

    async findById(id: number): Promise<OrderItem | null> {
        const query = 'SELECT * FROM order_items WHERE id_item = $1';
        const result = await this.db.query(query, [id]);
        return result.rows[0] || null;
    }

    async findByOrderId(orderId: number): Promise<OrderItem[]> {
        const query = `
      SELECT * FROM order_items 
      WHERE id_order = $1
      ORDER BY created_at DESC
    `;
        const result = await this.db.query(query, [orderId]);
        return result.rows;
    }

    async findByOrderAndProduct(orderId: number, productId: number): Promise<OrderItem | null> {
        const query = `
      SELECT * FROM order_items 
      WHERE id_order = $1 AND id_product = $2
    `;
        const result = await this.db.query(query, [orderId, productId]);
        return result.rows[0] || null;
    }

    async create(itemData: CreateOrderItemDTO): Promise<OrderItem> {
        const subtotal = itemData.price * itemData.quantity;

        const query = `
      INSERT INTO order_items (
        id_order, id_product, sku, title, brand, 
        price, original_price, discount_percentage, 
        quantity, thumbnail, subtotal
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

        const values = [
            itemData.id_order,
            itemData.id_product,
            itemData.sku,
            itemData.title,
            itemData.brand,
            itemData.price,
            itemData.original_price,
            itemData.discount_percentage,
            itemData.quantity,
            itemData.thumbnail,
            subtotal
        ];

        const result = await this.db.query(query, values);
        return result.rows[0];
    }

    async update(id: number, itemData: UpdateOrderItemDTO): Promise<OrderItem | null> {
        if (!itemData.quantity) return null;

        const query = `
      UPDATE order_items
      SET quantity = $1,
          subtotal = price * $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id_item = $2
      RETURNING *
    `;

        const result = await this.db.query(query, [itemData.quantity, id]);
        return result.rows[0] || null;
    }

    async incrementQuantity(id: number, amount: number): Promise<OrderItem | null> {
        const query = `
      UPDATE order_items
      SET quantity = quantity + $1,
          subtotal = price * (quantity + $1),
          updated_at = CURRENT_TIMESTAMP
      WHERE id_item = $2
      RETURNING *
    `;

        const result = await this.db.query(query, [amount, id]);
        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const query = 'DELETE FROM order_items WHERE id_item = $1';
        const result = await this.db.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async deleteByOrderId(orderId: number): Promise<number> {
        const query = 'DELETE FROM order_items WHERE id_order = $1';
        const result = await this.db.query(query, [orderId]);
        return result.rowCount ?? 0;
    }
}