import { ConfigService } from '@nestjs/config';
import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

import { filterImageFiles2, renameFile } from './helpers/';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Post('products')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: filterImageFiles2,
    storage: diskStorage({
      filename: renameFile,
      destination: './work/uploads',
    })

  }))
  uploadFileProduct(@UploadedFile() file: Express.Multer.File) {

    if(!file) throw new BadRequestException('File is not an image');
    
    return {
      secureURL: `${this.configService.get('HOST_API')}/files/product/${file.filename}`,
      file
    };
  }

  @Get(':product/:fileName')
  findProductImage(
    @Res() res: Response,
    @Param('fileName') fileName: string){

    const path = this.filesService.getStaticProductImage(fileName);
    res.sendFile(path);
  }
  
}
