import { IsString, IsNotEmpty, IsArray, IsDateString, IsMilitaryTime, IsOptional } from "class-validator";

export class UpdateSongDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    readonly title?: string;
    @IsArray()
    @IsOptional()
    @IsNotEmpty()
    @IsString({each: true})
    readonly artists?: string[];
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