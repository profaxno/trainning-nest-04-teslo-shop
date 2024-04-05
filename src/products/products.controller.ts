import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFile, BadRequestException, ValidationPipe, ArgumentMetadata, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filterImageFiles2, renameFile } from 'src/files/helpers';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateProductDto2 } from './dto/create-product.dto2';
import { Validator, ValidatorOptions } from 'class-validator';


interface Body {
  body: string;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':value')
  findOne(@Param('value') value: string) {
    return this.productsService.findOne(value);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

 
  @Post("/createUpload")
  @UseInterceptors(FilesInterceptor('files', 5, {
    fileFilter: filterImageFiles2,
    storage: diskStorage({
      filename: renameFile,
      destination: './work/uploads',
    })
  }))
  async createUploadImage(@Body() jsonProduct: any, @UploadedFiles() files: Express.Multer.File[]) {
    
    const createProductDto: CreateProductDto = JSON.parse(jsonProduct.body);
  
    if(!files) throw new BadRequestException('File is not an image');
    
    return this.productsService.createUploadImage(createProductDto, files);
  }

}
