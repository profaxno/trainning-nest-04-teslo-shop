import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { AutoMap } from "@automapper/classes";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
    name:'products'
})
export class Product {
    
    @ApiProperty({
        example: 'd7d7d7d7-d7d7-d7d7-d7d7-d7d7d7d7d7d',
        description: 'Product ID',
        uniqueItems: true
    })
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @AutoMap()
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product Price',
    })
    @AutoMap()
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        description: 'Product Description',
        default: null
    })
    @AutoMap()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true,
        default: null,
    })
    @AutoMap()
    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product Stock',
        default: 0,
    })
    @AutoMap()
    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['S', 'M', 'L', 'XL'],
        description: 'Product Sizes',
    })
    @AutoMap()
    @Column({
        type: 'text',
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'men',
        description: 'Product Gender',
    })
    @AutoMap()
    @Column({
        type: 'text'
    })
    gender: string;

    @ApiProperty({
        example: ['T-Shirt', 'T-Shirt', 'T-Shirt', 'T-Shirt', 'T-Shirt'],
        description: 'Product Tags',
    })
    @AutoMap()
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty()
    @AutoMap()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true, eager: true}
    )
    images?: ProductImage[]

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;

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
