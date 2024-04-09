import { IsEmail, IsString, Matches, Max, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(10)
    // @Matches(/^[a-zA-Z0-9]*$/, {
    //     message: 'password only accepts english and number'
    // })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(1)
    fullName: string;
}
