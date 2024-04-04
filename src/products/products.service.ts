import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID} from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto) {
    try{
      const {images = [], ...attributes} = createProductDto;

      const product = this.productRepository.create({
        images: images.map( image => this.productImageRepository.create({url: image})), 
        ...attributes});

      await this.productRepository.save(product);

      //return {...product, images};
      return product;

    }catch(error){
      this.logger.error(error);

      if(error.code === '23505'){
        throw new BadRequestException(`Product already exist [${error.detail}]`);
      }
      
      throw new InternalServerErrorException("General error, create no executed check server logs");
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const {page, limit} = paginationDto;
    
    const products = await this.productRepository.find({
      take: limit,
      skip: (page - 1) * limit,//se multiplica la pagina por el limit para "saltarse" esa cantidad de registros y simular que paso de pagina (la resta es para que la primera pagina sea la 1 y no la 0)
      relations: {
        images: true
      }
    })

    return products;
  }

  async findOne(value: string): Promise<Product> {

    let product: Product;

    if(isUUID(value)){
      product = await this.productRepository.findOneBy({ id: value })
    }

    if(!product){
      //product = await this.productRepository.findOneBy({ slug: value })

      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('UPPER(title) = :title or slug = :slug', {
          title: value.toUpperCase(),
          slug: value
        })
        .leftJoinAndSelect('product.images', 'prodImages')
        .getOne();
    }

    if(!product){
      throw new NotFoundException(`Product not found [${value}]`);
    }
    
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const {images = [], ...attributes} = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...attributes
    })

    if(!product){
      throw new NotFoundException(`Product not found [${id}]`);
    }

    //transaccion
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      //borrar imagenes previas y asignar nuevas imagenes
      if(images.length > 0){
        await queryRunner.manager.delete(ProductImage, {product: {id}});
        product.images = images.map( image => this.productImageRepository.create({url: image}));
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      if(images.length > 0) return product;
      
      return this.findOne(id);

    }catch(error){
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.logger.error(error);

      if(error.code === '23505'){
        throw new BadRequestException(`Product already exist [${error.detail}]`);
      }

      throw new InternalServerErrorException("General error, update no executed check server logs");
    }
      
  }

  async remove(id: string): Promise<any> {
    
    const product = await this.findOne(id);
    await this.productRepository.remove(product);

    /* investigar xq no funciona la promesa, en realidad si funciona pero 
    this.findOne(id)
      .then(product => this.productRepository.remove(product))
      .catch(error => Promise.reject(error) );
    */
  }

  async removeAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try{
      return await query
        .delete()
        .where({})
        .execute();

    }catch(error){
      this.logger.error(error);
      throw new InternalServerErrorException("General error, remove all no executed check server logs");
    }
  }
}
