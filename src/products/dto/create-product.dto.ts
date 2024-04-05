import { AutoMap } from "@automapper/classes";
import { Optional } from "@nestjs/common";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @IsOptional()
    idDto?: string;

    @AutoMap()
    @IsString()
    @MinLength(1)
    title: string;

    @AutoMap()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @AutoMap()
    @IsString()
    @IsOptional()
    description?: string;

    @AutoMap()
    @IsString()
    @IsOptional()
    slug?: string;

    @AutoMap()
    @IsInt()
    @IsPositive()
    stock?: number;

    @AutoMap()
    @IsString({each: true})
    @IsArray()
    sizes: string[];

    @AutoMap()
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @AutoMap()
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    tags: string[]

    @AutoMap()
    @IsArray()
    @Optional()
    images?: string[];
}
