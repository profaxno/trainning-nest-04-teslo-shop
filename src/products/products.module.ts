import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, ProductImage } from './entities';
import { ConfigModule } from '@nestjs/config';
import { ProductProfile } from './mapper/product.profile';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductProfile],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
  ],
  exports: [ProductsService]
})
export class ProductsModule {}
