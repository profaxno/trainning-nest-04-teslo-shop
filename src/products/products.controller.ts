import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFile, BadRequestException, ValidationPipe, ArgumentMetadata, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ValidRoles } from 'src/auth/interfaces/valid-roles.inteface';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { filterImageFiles2, renameFile } from 'src/files/helpers';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities';

interface Body {
  body: string;
}

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'Product was created', type: Product })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user) {
    return this.productsService.create(createProductDto, user);
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
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto, @GetUser() user: User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

 
  @Post("createUpload")
  @Auth(ValidRoles.admin)
  @UseInterceptors(FilesInterceptor('files', 5, {
    fileFilter: filterImageFiles2,
    storage: diskStorage({
      filename: renameFile,
      destination: './work/uploads',
    })
  }))
  async createUploadImage(@Body() jsonProduct: any, @UploadedFiles() files: Express.Multer.File[], @GetUser() user: User) {
    
    const createProductDto: CreateProductDto = JSON.parse(jsonProduct.body);
  
    if(!files) throw new BadRequestException('File is not an image');
    
    return this.productsService.createUploadImage(createProductDto, files, user);
  }

}
