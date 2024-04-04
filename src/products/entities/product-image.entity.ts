import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text'
    })
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE' } // Elimina todas las imagenes del producto si se elimina el producto.
    )
    product: Product;
}