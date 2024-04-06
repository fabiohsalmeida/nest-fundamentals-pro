import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song-dto';
import { Song } from './song.entity';
import { UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song-dto';
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination';

@Controller('songs')
export class SongsController {
    constructor(private songsService: SongsService) {}

    @Post()
    createNewSong(@Body() createSongDto: CreateSongDto): Promise<Song> {
        return this.songsService.create(createSongDto)
    }

    @Get('all')
    getAllSongs() {
        return this.songsService.findAll();
    }

    @Get('ordered')
    getAllSongsPaginatedAndOrdered(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.songsService.paginateAndOrder({page, limit});
    }

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number = 10
    ) : Promise<Pagination<Song>> {
        limit = limit > 100 ? 100 : limit;

        return this.songsService.paginate({page, limit});
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
