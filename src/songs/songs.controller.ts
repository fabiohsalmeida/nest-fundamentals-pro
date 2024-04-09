import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongRequestDto } from './dto/request/create-song-request.dto';
import { Song } from './song.entity';
import { UpdateResult } from 'typeorm';
import { UpdateSongRequestDto } from './dto/request/update-song-request.dto';
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination';
import { CreateSongResponseDto } from './dto/response/create-song-response.dto';
import { GetAllSongsResponseDto } from './dto/response/get-all-songs-response.dto';
import { JwtArtistGuard } from '../auth/artist.guard';

@Controller('songs')
export class SongsController {
    constructor(private songsService: SongsService) {}

    @Post()
    @UseGuards(JwtArtistGuard)
    createNewSong(
        @Body() createSongDto: CreateSongRequestDto,
        @Request() request
    ): Promise<CreateSongResponseDto> {
        console.log(request.user);
        return this.songsService.create(createSongDto)
    }

    @Get('all')
    getAllSongs(): Promise<GetAllSongsResponseDto> {
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
        @Body() recordToUpdate: UpdateSongRequestDto
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
