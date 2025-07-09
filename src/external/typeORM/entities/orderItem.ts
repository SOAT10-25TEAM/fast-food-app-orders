import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderEntity } from "./order";
import { ProductEntity } from "./product";

@Entity("order_items")
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({ name: "order_id" })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems)
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;
}
