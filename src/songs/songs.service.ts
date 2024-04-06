import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDto } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDto } from './dto/update-song-dto';

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

    async findAll() : Promise<Song[]> {
        return await this.songsRepository.find();
    }

    async findById(id: number) : Promise<Song> {
        return await this.songsRepository.findOneBy({id});
    }

    async update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
        return await this.songsRepository.update(id, recordToUpdate);
    }

    async deleteById(id: number) : Promise<void> {
        await this.songsRepository.delete({id});
    }
}
