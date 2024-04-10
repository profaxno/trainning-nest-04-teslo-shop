import { AutoMap } from "@automapper/classes";
import { Optional } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @IsOptional()
    idDto?: string;

    @ApiProperty()
    @AutoMap()
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @AutoMap()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty()
    @AutoMap()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @AutoMap()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @AutoMap()
    @IsInt()
    @IsPositive()
    stock?: number;

    @ApiProperty()
    @AutoMap()
    @IsString({each: true})
    @IsArray()
    sizes: string[];

    @ApiProperty()
    @AutoMap()
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty()
    @AutoMap()
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    tags: string[]

    @ApiProperty()
    @AutoMap()
    @IsArray()
    @Optional()
    images?: string[];
}
