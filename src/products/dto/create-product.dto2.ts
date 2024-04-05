import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { CreateProductDto } from "./create-product.dto";

export class CreateProductDto2 {

    @ApiProperty()
    body: CreateProductDto;

    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}

//     @ApiProperty({
//         description: 'Attachments',
//         type: 'array',
//         items: {
//           type: 'file',
//           items: {
//             type: 'string',
//             format: 'binary',
//           },
//         },
//       })
//       files: any[];
// }
