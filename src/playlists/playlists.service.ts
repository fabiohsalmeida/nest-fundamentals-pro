import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { In, Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { CreatePlaylistDto } from 'src/artists/create-playlist-dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class PlaylistsService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRepository: Repository<Playlist>,
        @InjectRepository(Song)
        private songRepository: Repository<Song>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async createPlaylist(
        playlistDto: CreatePlaylistDto
    ): Promise<Playlist> {
        const playlist = new Playlist();
        playlist.name = playlistDto.name;

        const songs = await this.songRepository.findBy({id: In(playlistDto.songs)});
        playlist.songs = songs;

        const user = await this.userRepository.findOneBy({id: playlistDto.user});
        playlist.user = user;

        return await this.playlistRepository.save(playlist);
    }

    async paginatePlaylists(options: IPaginationOptions) : Promise<Pagination<Playlist>> {
        return await paginate<Playlist>(this.playlistRepository, options)
    }
}
