import Database from '../database/connection';
import { Order, CreateOrderDTO } from '../../entities/order.entity';

export class OrderRepository {
    private db = Database.getInstance();

    async findById(id: number): Promise<Order | null> {
        const query = 'SELECT * FROM orders WHERE id_order = $1';
        const result = await this.db.query(query, [id]);
        return result.rows[0] || null;
    }

    async findActiveCartByUserId(userId: number): Promise<Order | null> {
        const query = `
      SELECT * FROM orders 
      WHERE id_user = $1 AND status = 'active'
      LIMIT 1
    `;
        const result = await this.db.query(query, [userId]);
        return result.rows[0] || null;
    }

    async create(orderData: CreateOrderDTO): Promise<Order> {
        const query = `
      INSERT INTO orders (id_user, status)
      VALUES ($1, $2)
      RETURNING *
    `;
        const status = orderData.status || 'active';
        const result = await this.db.query(query, [orderData.id_user, status]);
        return result.rows[0];
    }

    async updateStatus(id: number, status: string): Promise<Order | null> {
        const query = `
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id_order = $2
      RETURNING *
    `;
        const result = await this.db.query(query, [status, id]);
        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const query = 'DELETE FROM orders WHERE id_order = $1';
        const result = await this.db.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}