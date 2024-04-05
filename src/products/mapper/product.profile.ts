import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { Mapper, MappingProfile, createMap, forMember, forSelf, ignore, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";

import { CreateProductDto } from "../dto/create-product.dto";
import { Product } from "../entities";


@Injectable()
export class ProductProfile extends AutomapperProfile{

    constructor(
        @InjectMapper() mapper: Mapper,
        private readonly configService: ConfigService
    ) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return (source) => {
            createMap(source, CreateProductDto, Product, forMember( target => target.id, ignore()));
            createMap(
                source,
                Product,
                CreateProductDto,
                forMember( target => target.idDto, mapFrom( source => source.id)),
                forMember( target => target.images, mapFrom( source => source.images.map(image => `${this.configService.get('HOST_API')}/files/product/${image.url}` )))
            );
        }
    }
}