import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './create-song-dto';

@Controller('songs')
export class SongsController {
    constructor(private songsService: SongsService) {}

    @Post()
    createNewSong(@Body() createSongDto: CreateSongDto) {
        return this.songsService.create(createSongDto)
    }

    @Get()
    findAll() {
        return this.songsService.findAll()
    }

    @Get(':id')
    getSongById(@Param() params) {
        return `Get song by id ${params.id}`
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
