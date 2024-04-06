import { Injectable } from '@nestjs/common';
import { In, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDto } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDto } from './dto/update-song-dto';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>
    ) {}

    private readonly songs = []

    async create(songDto: CreateSongDto) : Promise<Song> {
        const song = new Song();
        song.title = songDto.title;
        song.duration = songDto.duration;
        song.lyrics = songDto.lyrics;
        song.releasedDate = songDto.releasedDate;

        const artists = await this.artistRepository.findBy({id: In(songDto.artists)});
        song.artists = artists;

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

    async paginate(options: IPaginationOptions) : Promise<Pagination<Song>> {
        return paginate<Song>(this.songsRepository, options);
    }

    async paginateAndOrder(options: IPaginationOptions) : Promise<Pagination<Song>> {
        const queryBuilder = this.songsRepository.createQueryBuilder('c');
        queryBuilder.orderBy('c.releasedDate', 'DESC');

        return paginate<Song>(queryBuilder, options);
    }
}
