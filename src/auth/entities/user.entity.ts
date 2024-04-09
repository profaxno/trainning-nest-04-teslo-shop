import { Product } from 'src/products/entities';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { 
        length: 50,
        unique: true
    })
    email: string;

    @Column('text', { 
        select: false
    })
    password: string;

    @Column('varchar', { length: 100 })
    fullName: string;

    @Column('boolean', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product;


    @BeforeInsert()
    @BeforeUpdate()
    checkFields(){
        this.email = this.email.toLowerCase().trim();
    }
    
}
