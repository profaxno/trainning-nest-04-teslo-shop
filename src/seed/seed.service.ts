import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  
  constructor(
    private readonly productsService: ProductsService,
  ){}


  async populateDb() {
    await this.productsService.removeAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product));
    })

    await Promise.all(insertPromises);

    return `seed executed`;
  }
}
