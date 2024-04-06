import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from 'src/artists/create-playlist-dto';
import { Playlist } from './playlist.entity';

@Controller('playlists')
export class PlaylistsController {
    constructor(private playlistService: PlaylistsService) {}

    @Post()
    createPlaylist(
        @Body() playlistDto: CreatePlaylistDto
    ) : Promise<Playlist> {
        return this.playlistService.createPlaylist(playlistDto);
    }

    @Get()
    getPaginatedPlaylists(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.playlistService.paginatePlaylists({page, limit});
    }
}
