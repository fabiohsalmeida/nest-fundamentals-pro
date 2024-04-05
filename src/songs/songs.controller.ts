import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './create-song-dto';
import { Song } from './song.entity';

@Controller('songs')
export class SongsController {
    constructor(private songsService: SongsService) {}

    @Post()
    createNewSong(@Body() createSongDto: CreateSongDto): Promise<Song> {
        return this.songsService.create(createSongDto)
    }

    @Get()
    findAll() {
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
    ) id: number) {
        return `Get song by id ${id}`
    }

    @Put(':id')
    putSong(@Param() params) {
        return `Put song by id ${params.id}`
    }

    @Delete(':id')
    deleteSong(@Param() params) {
        return `Delete song by id ${params.id}`
    }
}
