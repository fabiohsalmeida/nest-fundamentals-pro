import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePlaylistDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    songs: number[];

    @IsNotEmpty()
    @IsNumber()
    user: number
}