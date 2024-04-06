import { IsString, IsNotEmpty, IsArray, IsDateString, IsMilitaryTime, IsOptional, IsNumber } from "class-validator";

export class UpdateSongDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    readonly title?: string;
    // @IsOptional()
    // @IsArray()
    // @IsNumber({}, { each: true} )
    // readonly artists: number[];
    @IsOptional()
    @IsNotEmpty()
    @IsDateString()
    readonly releasedDate?: Date;
    @IsOptional()
    @IsNotEmpty()
    @IsMilitaryTime()
    readonly duration?: Date
    @IsString()
    @IsOptional()
    readonly lyrics?: string;
}