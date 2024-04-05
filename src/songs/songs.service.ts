import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDto } from './create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songsRepository: Repository<Song>
    ) {}

    private readonly songs = []

    async create(songDto: CreateSongDto) : Promise<Song> {
        const song = new Song();
        song.title = songDto.title;
        song.artists = songDto.artists;
        song.duration = songDto.duration;
        song.lyrics = songDto.lyrics;
        song.releasedDate = songDto.releasedDate;
        return await this.songsRepository.save(song);
    }

    findAll() {
        throw new Error('Error in db while fetching record');

        return this.songs;
    }
}
