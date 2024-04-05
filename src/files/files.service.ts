import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  
  getStaticProductImage(fileName: string){

    const path = join(__dirname, '../../work/uploads', fileName);

    if(existsSync(path)){
      return path;
    }

    throw new BadRequestException(`No product found with image ${fileName}`)
  }

}
