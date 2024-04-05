import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { AutoMap } from "@automapper/classes";

@Entity({
    name:'products'
})
export class Product {
    
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column('text', {
        unique: true
    })
    title: string;

    @AutoMap()
    @Column('float', {
        default: 0
    })
    price: number;

    @AutoMap()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @AutoMap()
    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @AutoMap()
    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @AutoMap()
    @Column({
        type: 'text',
        array: true
    })
    sizes: string[];

    @AutoMap()
    @Column({
        type: 'text'
    })
    gender: string;

    @AutoMap()
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[];

    @AutoMap()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true, eager: true}
    )
    images?: ProductImage[]

    @BeforeInsert()
    @BeforeUpdate()
    checkSlug(){
        if(!this.slug){
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
    
}
