import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song-dto';
import { Song } from './song.entity';
import { UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song-dto';

@Controller('songs')
export class SongsController {
    constructor(private songsService: SongsService) {}

    @Post()
    createNewSong(@Body() createSongDto: CreateSongDto): Promise<Song> {
        return this.songsService.create(createSongDto)
    }

    @Get()
    findAll() : Promise<Song[]> {
        try {
            return this.songsService.findAll()
        } catch(e) {
            throw new HttpException(
                'error', HttpStatus.FORBIDDEN
            )
        }
    }

    @Get(':id')
    getSongById(@Param(
        'id',
        new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    ) id: number) : Promise<Song> {
        return this.songsService.findById(id);
    }

    @Put(':id')
    putSong(
        @Param('id', ParseIntPipe) id: number,
        @Body() recordToUpdate: UpdateSongDto
    ) : Promise<UpdateResult> {
        return this.songsService.update(id, recordToUpdate);
    }

    @Delete(':id')
    deleteSong(@Param(
        'id',
        new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    ) id) : void {
        this.songsService.deleteById(id);
    }
}
