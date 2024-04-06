import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './create-artist-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Artist } from './artist.entity';

@Controller('artists')
export class ArtistsController {
    constructor(private artistsService: ArtistsService) {}

    // TODO create a decorator for controlling limit value
    @Get()
    getPaginatedArtists(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number
    ) : Promise<Pagination<Artist>> {
        limit = limit > 100 ? 100 : limit;

        return this.artistsService.getPaginatedArtists({page, limit});
    }

    @Post()
    createArtist(
        @Body() artistDto: CreateArtistDto
    ) : Promise<Artist> {
        return this.artistsService.createArtist(artistDto);
    }
}
