import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Jane',
        description: 'provide the firstName of the user'
    })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Doe',
        description: 'provide the lastName of the user'
    })
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'jane.doe@email.com',
        description: 'provide the email of the user'
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123456',
        description: 'provide the password of the user'
    })
    password: string;
}