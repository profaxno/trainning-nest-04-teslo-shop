import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SeedService {
  
  constructor(
    private readonly productsService: ProductsService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}


  async populateDb() {
    await this.cleanDb();
    const adminUser = await this.insertUsers();
    await this.insertProducts(adminUser);

    return `seed executed`;
  }

  private async cleanDb(){
    await this.productsService.removeAllProducts();
    await this.userRepository.delete({});
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    
    const insertPromises = [];

    seedUsers.forEach(user => {
      insertPromises.push(this.authService.create(user));
    })

    const dbUsers = await Promise.all(insertPromises);

    return dbUsers[0];
  }

  private async insertUsersWithRepository() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach(seedUser => {
      users.push(this.userRepository.create(seedUser));
    });

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }

  private async insertProducts(user: User) {
    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user));
    })

    await Promise.all(insertPromises);
  }

}
